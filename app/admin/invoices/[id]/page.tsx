import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InvoiceStatusSelect } from "@/components/portal/invoices/InvoiceStatusSelect";

export const metadata = { title: "Facture — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 2 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: { client: true, project: true },
  });
  if (!invoice) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 gap-1.5 text-muted-foreground">
          <Link href="/admin/invoices">
            <ArrowLeft className="h-3.5 w-3.5" />
            Factures
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold tracking-tight">{invoice.number}</h1>
            <InvoiceStatusSelect invoiceId={invoice.id} initialStatus={invoice.status} />
          </div>
          <Button asChild variant="outline" size="sm" className="gap-1.5">
            <a href={`/admin/invoices/${invoice.id}/pdf`} target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
              Télécharger le PDF
            </a>
          </Button>
        </div>
      </div>

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle className="text-sm">Détails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Client</span>
            <Link href={`/admin/clients/${invoice.client.id}`} className="font-medium hover:text-primary">
              {invoice.client.fullName}
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projet</span>
            <Link href={`/admin/projects/${invoice.project.id}`} className="font-medium hover:text-primary">
              {invoice.project.title}
            </Link>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Échéance</span>
            <span className="font-medium">{invoice.dueDate.toLocaleDateString("fr-FR")}</span>
          </div>
          {invoice.paidAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payée le</span>
              <span className="font-medium">{invoice.paidAt.toLocaleDateString("fr-FR")}</span>
            </div>
          )}
          <div className="flex justify-between border-t pt-3 text-base">
            <span className="text-muted-foreground">Montant</span>
            <span className="font-semibold">{formatMoney(Number(invoice.amount), invoice.currency)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
