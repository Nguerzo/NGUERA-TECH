import { db } from "@/lib/db";
import { LeadBoard, type BoardLead } from "@/components/portal/crm/LeadBoard";
import { NewLeadDialog } from "@/components/portal/crm/NewLeadDialog";

export const metadata = { title: "CRM — Portail NGUERA SENEGALENSIS TECH" };

export default async function CrmPage() {
  const leads = await db.lead.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      company: true,
      email: true,
      country: true,
      budget: true,
      currency: true,
      source: true,
      status: true,
      createdAt: true,
    },
  });

  const boardLeads: BoardLead[] = leads.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">CRM</h1>
        </div>
        <NewLeadDialog />
      </div>

      {boardLeads.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          Aucun prospect pour le moment — ils apparaîtront ici dès la première demande via le site ou un ajout manuel.
        </div>
      ) : (
        <LeadBoard leads={boardLeads} />
      )}
    </div>
  );
}
