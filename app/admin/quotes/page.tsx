import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewQuoteDialog } from "@/components/portal/quotes/NewQuoteDialog";
import { QUOTE_STATUS_LABEL, QUOTE_STATUS_STYLE } from "@/lib/quotes/labels";
import { cn } from "@/lib/utils";

export const metadata = { title: "Devis — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function QuotesPage() {
  const [quotes, clients, projects] = await Promise.all([
    db.quote.findMany({
      orderBy: { createdAt: "desc" },
      include: { client: true, items: true },
    }),
    db.user.findMany({ where: { role: "CLIENT" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true, email: true } }),
    db.project.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, title: true, clientId: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Devis</h1>
        </div>
        <NewQuoteDialog clients={clients} projects={projects} />
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          {clients.length === 0 ? "Créez d'abord un client avant de pouvoir lui envoyer un devis." : "Aucun devis pour le moment."}
        </div>
      ) : (
        <div className="space-y-3">
          {quotes.map((q) => {
            const total = q.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);
            return (
              <Card key={q.id}>
                <CardContent className="flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/quotes/${q.id}`} className="text-sm font-medium hover:text-primary">
                      {q.number}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {q.client.fullName} — {formatMoney(total, q.currency)}
                    </p>
                  </div>
                  <Badge variant="secondary" className={cn("border-0 font-medium", QUOTE_STATUS_STYLE[q.status])}>
                    {QUOTE_STATUS_LABEL[q.status]}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
