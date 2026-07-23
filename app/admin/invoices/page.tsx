import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewInvoiceDialog } from "@/components/portal/invoices/NewInvoiceDialog";
import { INVOICE_STATUS_LABEL, INVOICE_STATUS_STYLE } from "@/lib/invoices/labels";
import { cn } from "@/lib/utils";

export const metadata = { title: "Factures — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function AdminInvoicesPage() {
  const [invoices, projects] = await Promise.all([
    db.invoice.findMany({ orderBy: { createdAt: "desc" }, include: { project: true, client: true } }),
    db.project.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, client: { select: { fullName: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Factures</h1>
        </div>
        <NewInvoiceDialog projects={projects} />
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          {projects.length === 0 ? "Créez d'abord un projet avant de pouvoir le facturer." : "Aucune facture pour le moment."}
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="flex items-center justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/invoices/${inv.id}`} className="text-sm font-medium hover:text-primary">
                    {inv.number}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {inv.client.fullName} — {inv.project.title} — {formatMoney(Number(inv.amount), inv.currency)}
                  </p>
                </div>
                <Badge variant="secondary" className={cn("border-0 font-medium", INVOICE_STATUS_STYLE[inv.status])}>
                  {INVOICE_STATUS_LABEL[inv.status]}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
