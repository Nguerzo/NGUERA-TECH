import Link from "next/link";
import { db } from "@/lib/db";
import { StatCard } from "@/components/portal/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, FolderKanban, Wallet, FileText, ArrowUpRight } from "lucide-react";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
  } catch {
    return `${amount.toLocaleString("fr-FR")} ${currency}`;
  }
}

function relativeTime(date: Date) {
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export default async function AdminDashboardPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [newLeadsCount, recentLeadsCount, activeProjectsCount, openQuotesCount, revenueByCurrency, recentLeads, recentProjects, recentInvoices, recentQuotes] =
    await Promise.all([
      db.lead.count({ where: { status: "NOUVEAU" } }),
      db.lead.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
      db.project.count({ where: { status: { in: ["ANALYSE", "DEVELOPPEMENT", "TESTS"] } } }),
      db.quote.count({ where: { status: { in: ["BROUILLON", "ENVOYE"] } } }),
      db.invoice.groupBy({ by: ["currency"], where: { status: "PAYEE" }, _sum: { amount: true } }),
      db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, fullName: true, company: true, createdAt: true } }),
      db.project.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, createdAt: true, client: { select: { fullName: true } } } }),
      db.invoice.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, number: true, amount: true, currency: true, createdAt: true, client: { select: { fullName: true } } } }),
      db.quote.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, number: true, createdAt: true, client: { select: { fullName: true } } } }),
    ]);

  const activity = [
    ...recentLeads.map((l) => ({
      id: `lead-${l.id}`,
      date: l.createdAt,
      label: `Nouveau prospect — ${l.fullName}${l.company ? ` (${l.company})` : ""}`,
      href: "/admin/clients",
    })),
    ...recentProjects.map((p) => ({
      id: `project-${p.id}`,
      date: p.createdAt,
      label: `Projet créé — ${p.title}${p.client ? ` pour ${p.client.fullName}` : ""}`,
      href: "/admin/projects",
    })),
    ...recentInvoices.map((i) => ({
      id: `invoice-${i.id}`,
      date: i.createdAt,
      label: `Facture ${i.number} — ${formatMoney(Number(i.amount), i.currency)}${i.client ? ` — ${i.client.fullName}` : ""}`,
      href: "/admin/invoices",
    })),
    ...recentQuotes.map((q) => ({
      id: `quote-${q.id}`,
      date: q.createdAt,
      label: `Devis ${q.number}${q.client ? ` — ${q.client.fullName}` : ""}`,
      href: `/admin/quotes/${q.id}`,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 8);

  const revenueHint =
    revenueByCurrency.length === 0
      ? "Aucune facture payée"
      : revenueByCurrency
          .filter((r) => r.currency !== revenueByCurrency[0].currency)
          .map((r) => formatMoney(Number(r._sum.amount ?? 0), r.currency))
          .join(" · ") || undefined;

  const mainRevenue = revenueByCurrency[0];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Tableau de bord</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={UserPlus}
          label="Nouveaux prospects"
          value={String(newLeadsCount)}
          hint={`${recentLeadsCount} reçus cette semaine`}
        />
        <StatCard icon={FolderKanban} label="Projets actifs" value={String(activeProjectsCount)} />
        <StatCard
          icon={Wallet}
          label="Chiffre d'affaires"
          value={mainRevenue ? formatMoney(Number(mainRevenue._sum.amount ?? 0), mainRevenue.currency) : formatMoney(0, "XOF")}
          hint={revenueHint}
        />
        <StatCard icon={FileText} label="Devis en cours" value={String(openQuotesCount)} hint="Brouillon ou envoyé" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          {activity.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucune activité pour le moment — elle apparaîtra ici dès le premier prospect, projet ou facture.
            </p>
          ) : (
            <ul className="divide-y">
              {activity.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-4 py-3 text-sm transition-colors hover:text-primary"
                  >
                    <span className="min-w-0 truncate">{item.label}</span>
                    <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      {relativeTime(item.date)}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div>
        <Badge variant="outline" className="font-mono text-[10px]">
          NOTIFICATIONS — MODULE À VENIR
        </Badge>
      </div>
    </div>
  );
}
