import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Building2 } from "lucide-react";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActivityTimeline, type TimelineActivity } from "@/components/portal/crm/ActivityTimeline";
import { PROJECT_STATUS, INVOICE_STATUS } from "@/lib/statusMaps";

export const metadata = { title: "Client — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await db.user.findUnique({
    where: { id, role: "CLIENT" },
    include: {
      projects: { orderBy: { createdAt: "desc" } },
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!client) notFound();

  const originLead = await db.lead.findUnique({
    where: { convertedClientId: client.id },
    include: { activities: { orderBy: { createdAt: "desc" }, include: { author: { select: { fullName: true } } } } },
  });

  const originActivities: TimelineActivity[] =
    originLead?.activities.map((a) => ({
      id: a.id,
      type: a.type,
      content: a.content,
      oldStatus: a.oldStatus,
      newStatus: a.newStatus,
      createdAt: a.createdAt.toISOString(),
      author: a.author,
    })) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 gap-1.5 text-muted-foreground">
          <Link href="/admin/clients">
            <ArrowLeft className="h-3.5 w-3.5" />
            Clients
          </Link>
        </Button>
        <div className="flex items-center gap-3">
          <Avatar className="h-11 w-11">
            <AvatarFallback>{initials(client.fullName)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">{client.fullName}</h1>
            {client.companyName && <p className="text-sm text-muted-foreground">{client.companyName}</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Coordonnées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2.5 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {client.email}
              </div>
              {client.phone && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {client.phone}
                </div>
              )}
              {client.companyName && (
                <div className="flex items-center gap-2.5 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  {client.companyName}
                </div>
              )}
              <p className="pt-1 text-xs text-muted-foreground">
                Client depuis le {client.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </CardContent>
          </Card>

          {originLead && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Historique prospect (CRM)</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityTimeline activities={originActivities} />
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Projets ({client.projects.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {client.projects.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucun projet pour ce client.</p>
              ) : (
                <ul className="divide-y">
                  {client.projects.map((p) => {
                    const status = PROJECT_STATUS[p.status];
                    return (
                      <li key={p.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{p.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {p.createdAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                        <Badge variant="secondary">{status?.label ?? p.status}</Badge>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Factures ({client.invoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {client.invoices.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">Aucune facture pour ce client.</p>
              ) : (
                <ul className="divide-y">
                  {client.invoices.map((inv) => {
                    const status = INVOICE_STATUS[inv.status];
                    return (
                      <li key={inv.id} className="flex items-center justify-between gap-3 py-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{inv.number}</p>
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
