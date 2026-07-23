import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewClientDialog } from "@/components/portal/clients/NewClientDialog";
import { ConvertLeadDialog } from "@/components/portal/clients/ConvertLeadDialog";

export const metadata = { title: "Clients — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

export default async function AdminClientsPage() {
  const [clients, wonLeads] = await Promise.all([
    db.user.findMany({
      where: { role: "CLIENT" },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { projects: true, invoices: true } } },
    }),
    db.lead.findMany({
      where: { status: "GAGNE", convertedClientId: null },
      orderBy: { createdAt: "desc" },
      select: { id: true, fullName: true, email: true, company: true },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Clients</h1>
        </div>
        <NewClientDialog />
      </div>

      {wonLeads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Prospects gagnés à convertir</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {wonLeads.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{lead.fullName}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {lead.email}
                    {lead.company ? ` — ${lead.company}` : ""}
                  </p>
                </div>
                <ConvertLeadDialog leadId={lead.id} fullName={lead.fullName} email={lead.email} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Tous les clients</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              Aucun client pour le moment — créez-en un, ou convertissez un prospect gagné.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Projets</TableHead>
                  <TableHead className="text-right">Factures</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link href={`/admin/clients/${c.id}`} className="flex items-center gap-2.5 hover:text-primary">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[11px]">{initials(c.fullName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium leading-tight">{c.fullName}</p>
                          {c.companyName && <p className="text-xs text-muted-foreground">{c.companyName}</p>}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{c.email}</TableCell>
                    <TableCell className="text-right">{c._count.projects}</TableCell>
                    <TableCell className="text-right">{c._count.invoices}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
