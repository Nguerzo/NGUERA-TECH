import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QuoteStatusSelect } from "@/components/portal/quotes/QuoteStatusSelect";

export const metadata = { title: "Devis — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const quote = await db.quote.findUnique({
    where: { id },
    include: { client: true, project: true, items: { orderBy: { position: "asc" } } },
  });
  if (!quote) notFound();

  const total = quote.items.reduce((sum, item) => sum + Number(item.quantity) * Number(item.unitPrice), 0);

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 gap-1.5 text-muted-foreground">
          <Link href="/admin/quotes">
            <ArrowLeft className="h-3.5 w-3.5" />
            Devis
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{quote.number}</h1>
            <QuoteStatusSelect quoteId={quote.id} initialStatus={quote.status} />
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a href={`/admin/quotes/${quote.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
              Télécharger le PDF
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <Link href={`/admin/clients/${quote.client.id}`} className="font-medium hover:text-primary">
              {quote.client.fullName}
            </Link>
            <p className="text-muted-foreground">{quote.client.email}</p>
            {quote.project && (
              <p className="pt-2 text-xs text-muted-foreground">
                Projet lié :{" "}
                <Link href={`/admin/projects/${quote.project.id}`} className="hover:text-primary">
                  {quote.project.title}
                </Link>
              </p>
            )}
            {quote.validUntil && (
              <p className="pt-1 text-xs text-muted-foreground">Valable jusqu&apos;au {quote.validUntil.toLocaleDateString("fr-FR")}</p>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Lignes du devis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="divide-y">
              {quote.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div>
                    <p>{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {Number(item.quantity)} × {formatMoney(Number(item.unitPrice), quote.currency)}
                    </p>
                  </div>
                  <p className="font-medium">{formatMoney(Number(item.quantity) * Number(item.unitPrice), quote.currency)}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-end border-t pt-3">
              <p className="text-base font-semibold">Total : {formatMoney(total, quote.currency)}</p>
            </div>
            {quote.notes && (
              <div className="mt-4 border-t pt-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Notes</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{quote.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
