import { db } from "@/lib/db";
import InvoiceForm from "./InvoiceForm";
import { Receipt } from "lucide-react";
import Badge from "@/components/dashboard/Badge";
import EmptyState from "@/components/dashboard/EmptyState";
import { INVOICE_STATUS } from "@/lib/statusMaps";

export default async function AdminInvoicesPage() {
  const [invoices, projects] = await Promise.all([
    db.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { project: true, client: true } }),
    // select uniquement les champs affichés dans le formulaire : les Decimal de Prisma
    // (ex. budgetEstime) ne sont pas des objets sérialisables entre Server et Client Components.
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, client: { select: { fullName: true } } },
    }),
  ]);

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="kicker">Back-office</span>
        <h2>Factures</h2>
      </div>

      <div className="dash-panel" style={{ padding: 32, marginBottom: 48, maxWidth: 640 }}>
        <h3 style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
          Nouvelle facture
        </h3>
        {projects.length === 0 ? (
          <p style={{ color: "var(--ivory-faint)", fontSize: 14 }}>
            Créez d'abord un projet avant de pouvoir le facturer.
          </p>
        ) : (
          <InvoiceForm projects={projects} />
        )}
      </div>

      {invoices.length === 0 ? (
        <EmptyState icon={Receipt}>Aucune facture pour le moment.</EmptyState>
      ) : (
        <div className="dash-panel" style={{ padding: "4px 20px", overflowX: "auto" }}>
          <table className="dash-table">
            <thead>
              <tr>
                <th>N° facture</th>
                <th>Client</th>
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
                    <td>{inv.client.fullName}</td>
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
