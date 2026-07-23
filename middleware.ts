import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

// Chemins qui exigent une session active. La vérification fine du rôle
// (CLIENT vs ADMIN) se fait ensuite dans chaque page via requireRole() —
// ce middleware est une première barrière rapide, pas la seule.
const PROTECTED_PREFIXES = ["/dashboard", "/projets", "/factures", "/admin"];

// Chemins internes à l'application (back-office) qui ne passent jamais par le
// routage i18n — ils restent en français, non préfixés.
const APP_PREFIXES = [...PROTECTED_PREFIXES, "/login", "/api"];

const intlMiddleware = createIntlMiddleware(routing);

async function handleAuth(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request: { headers: request.headers } });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isProtected = PROTECTED_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p));

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAppPath = APP_PREFIXES.some((p) => pathname.startsWith(p));

  if (isAppPath) {
    // Back-office (client + admin) : jamais localisé, logique d'auth existante.
    return pathname.startsWith("/login") ? NextResponse.next() : handleAuth(request);
  }

  // Site public (marketing) : routage de langue EN (par défaut) / FR (/fr).
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon.png).*)"],
};
