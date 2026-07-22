import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import ClientSidebar from "@/components/ClientSidebar";

export const metadata: Metadata = {
  title: "Espace client — NGUERA SENEGALENSIS TECH",
  description: "Suivez vos projets, factures et documents.",
};

// Toujours dynamique (auth + données par utilisateur) : évite que `next build`
// tente une pré-analyse statique qui ouvre une connexion DB pour rien.
export const dynamic = "force-dynamic";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  // CLIENT, TEAM et ADMIN peuvent consulter l'espace client (une équipe interne
  // doit pouvoir voir ce que voit un client pour le support).
  const user = await requireRole(["CLIENT", "TEAM", "ADMIN"]);

  return (
    <div className="dash-shell">
      <ClientSidebar userName={user.fullName} userRole={user.role} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
