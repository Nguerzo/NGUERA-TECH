import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase à utiliser UNIQUEMENT côté navigateur (composants "use client").
 * N'expose que la clé publique anon — jamais la clé service_role.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
