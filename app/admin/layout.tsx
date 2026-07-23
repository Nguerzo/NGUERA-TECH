import type { Metadata } from "next";
import "@/styles/portal.css";
import { requireRole } from "@/lib/auth";
import { ThemeProvider } from "@/components/portal/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import PortalShell from "@/components/portal/PortalShell";

export const metadata: Metadata = {
  title: "Portail — NGUERA SENEGALENSIS TECH",
  description: "Plateforme interne : CRM, projets, devis, facturation.",
};

// Toujours dynamique (auth + données par utilisateur) : évite que `next build`
// tente une pré-analyse statique qui ouvre une connexion DB pour rien.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Seuls ADMIN et TEAM accèdent au portail interne.
  const user = await requireRole(["ADMIN", "TEAM"]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="portal-root min-h-screen">
        <PortalShell userName={user.fullName} userRole={user.role}>
          {children}
        </PortalShell>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
