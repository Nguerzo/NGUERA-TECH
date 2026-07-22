import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Receipt } from "lucide-react";
import Badge from "@/components/dashboard/Badge";
import EmptyState from "@/components/dashboard/EmptyState";
import { INVOICE_STATUS } from "@/lib/statusMaps";

export default async function FacturesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isClient = user.role === "CLIENT";
  const invoices = await db.invoice.findMany({
    where: isClient ? { clientId: user.id } : {},
    orderBy: { dueDate: "desc" },
    include: { project: true },
  });

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="kicker">Facturation</span>
        <h2>Mes factures</h2>
        <p className="section-sub">
          Le paiement en ligne sera activé en phase 4, une fois les comptes marchands configurés.
        </p>
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt}>Aucune facture pour le moment.</EmptyState>
      ) : (
        <div className="dash-panel" style={{ padding: "4px 20px", overflowX: "auto" }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>N° facture</th>
                <th>Projet</th>
                <th>Échéance</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => {
                const status = INVOICE_STATUS[inv.status] ?? { label: inv.status, variant: "neutral" as const, icon: Receipt };
                return (
                  <tr key={inv.id}>
                    <td style={{ fontFamily: "var(--mono)" }}>{inv.number}</td>
                    <td>{inv.project.title}</td>
                    <td>{new Date(inv.dueDate).toLocaleDateString("fr-FR")}</td>
                    <td>
                      {Number(inv.amount).toLocaleString("fr-FR")} {inv.currency}
                    </td>
                    <td>
                      <Badge icon={status.icon} variant={status.variant}>
                        {status.label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
