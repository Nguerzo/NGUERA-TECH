import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Calendar, Wallet } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectStatusSelect } from "@/components/portal/projects/ProjectStatusSelect";
import { INVOICE_STATUS } from "@/lib/statusMaps";

export const metadata = { title: "Projet — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const project = await db.project.findUnique({
    where: { id },
    include: { client: true, invoices: { orderBy: { createdAt: "desc" } } },
  });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 gap-1.5 text-muted-foreground">
          <Link href="/admin/projects">
            <ArrowLeft className="h-3.5 w-3.5" />
            Projets
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{project.title}</h1>
          <ProjectStatusSelect projectId={project.id} initialStatus={project.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <Link href={`/admin/clients/${project.client.id}`} className="hover:text-primary">
                  {project.client.fullName}
                </Link>
              </div>
              {project.budgetEstime && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  {formatMoney(Number(project.budgetEstime), "XOF")}
                </div>
              )}
              {(project.dateDebut || project.dateLivraison) && (
                <div className="flex items-start gap-2.5 text-sm">
                  <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    {project.dateDebut && <p>Début : {project.dateDebut.toLocaleDateString("fr-FR")}</p>}
                    {project.dateLivraison && <p>Livraison : {project.dateLivraison.toLocaleDateString("fr-FR")}</p>}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Factures ({project.invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {project.invoices.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucune facture liée à ce projet.</p>
              ) : (
                <ul className="divide-y">
                  {project.invoices.map((inv) => {
                    const status = INVOICE_STATUS[inv.status];
                    return (
                      <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                        <div>
                          <p className="text-sm font-medium">{inv.number}</p>
                          <p className="text-xs text-muted-foreground">{formatMoney(Number(inv.amount), inv.currency)}</p>
                        </div>
                        <Badge variant="secondary">{status?.label ?? inv.status}</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
