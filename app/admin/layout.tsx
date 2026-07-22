import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import AdminSidebar from "@/components/AdminSidebar";

export const metadata: Metadata = {
  title: "Back-office — NGUERA SENEGALENSIS TECH",
  description: "Gestion des clients, projets et factures.",
};

// Toujours dynamique (auth + données par utilisateur) : évite que `next build`
// tente une pré-analyse statique qui ouvre une connexion DB pour rien.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Seuls ADMIN et TEAM peuvent gérer clients/projets/factures.
  const user = await requireRole(["ADMIN", "TEAM"]);

  return (
    <div className="dash-shell">
      <AdminSidebar userName={user.fullName} userRole={user.role} />
      <main className="dash-main">{children}</main>
    </div>
  );
}
