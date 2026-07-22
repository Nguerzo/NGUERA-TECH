import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FolderKanban, Clock, AlertTriangle, Wallet, FolderOpen } from "lucide-react";
import StatGrid from "@/components/dashboard/StatGrid";
import EmptyState from "@/components/dashboard/EmptyState";
import Badge from "@/components/dashboard/Badge";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // TEAM/ADMIN voient un agrégat global ; CLIENT ne voit que ses propres données.
  const isClient = user.role === "CLIENT";
  const projectFilter = isClient ? { clientId: user.id } : {};
  const invoiceFilter = isClient ? { clientId: user.id } : {};

  const [projects, invoices] = await Promise.all([
    db.project.findMany({ where: projectFilter, orderBy: { createdAt: "desc" }, take: 5 }),
    db.invoice.findMany({ where: invoiceFilter, orderBy: { dueDate: "asc" } }),
  ]);

  const enCours = projects.filter((p) => p.status === "EN_COURS").length;
  const enRetard = invoices.filter((i) => i.status === "EN_RETARD").length;
  const totalDu = invoices
    .filter((i) => i.status !== "PAYEE")
    .reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 32 }}>
        <span className="kicker">Vue d'ensemble</span>
        <h2>Bonjour {user.fullName.split(" ")[0]}.</h2>
      </div>

      <div style={{ marginBottom: 48 }}>
        <StatGrid
          stats={[
            { icon: <FolderKanban />, value: String(projects.length), label: `Projets${isClient ? "" : " (tous clients)"}`, variant: "cyan" },
            { icon: <Clock />, value: String(enCours), label: "En cours", variant: "ochre" },
            { icon: <AlertTriangle />, value: String(enRetard), label: "Factures en retard", variant: enRetard > 0 ? "alert" : "cyan" },
            { icon: <Wallet />, value: `${totalDu.toLocaleString("fr-FR")} FCFA`, label: "Reste à payer", variant: "violet" },
          ]}
        />
      </div>

      <div className="section-head" style={{ marginBottom: 20 }}>
        <h3 style={{ fontFamily: "var(--display)", fontSize: 18 }}>Projets récents</h3>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderOpen}>Aucun projet pour le moment. Il apparaîtra ici dès qu'il sera créé côté administration.</EmptyState>
      ) : (
        <div className="dash-panel" style={{ overflow: "hidden" }}>
          {projects.map((p, i) => (
            <div
              key={p.id}
              style={{
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTop: i === 0 ? "none" : "1px solid var(--glass-border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 14.5 }}>{p.title}</div>
                <div style={{ fontSize: 12.5, color: "var(--ivory-faint)", marginTop: 2 }}>
                  {p.dateLivraison
                    ? `Livraison prévue : ${new Date(p.dateLivraison).toLocaleDateString("fr-FR")}`
                    : "Date de livraison non définie"}
                </div>
              </div>
              <Badge variant="cyan">{p.status.replace("_", " ")}</Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
