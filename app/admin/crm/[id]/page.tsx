import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Mail, Phone, Globe, Languages, Wallet, ArrowUpRight } from "lucide-react";
import { db } from "@/lib/db";
import { getLeadAttachmentSignedUrl } from "@/lib/supabase/storage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeadStatusBadge } from "@/components/portal/crm/LeadStatusBadge";
import { ActivityTimeline, type TimelineActivity } from "@/components/portal/crm/ActivityTimeline";
import { NoteComposer } from "@/components/portal/crm/NoteComposer";
import { AttachmentPanel, type AttachmentItem } from "@/components/portal/crm/AttachmentPanel";
import { leadSourceLabel } from "@/lib/crm/labels";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Prospect — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const lead = await db.lead.findUnique({
    where: { id },
    include: {
      activities: { orderBy: { createdAt: "desc" }, include: { author: { select: { fullName: true } } } },
      attachments: { orderBy: { createdAt: "desc" }, include: { uploadedBy: { select: { fullName: true } } } },
    },
  });

  if (!lead) notFound();

  const activities: TimelineActivity[] = lead.activities.map((a) => ({
    id: a.id,
    type: a.type,
    content: a.content,
    oldStatus: a.oldStatus,
    newStatus: a.newStatus,
    createdAt: a.createdAt.toISOString(),
    author: a.author,
  }));

  const attachments: AttachmentItem[] = await Promise.all(
    lead.attachments.map(async (a) => ({
      id: a.id,
      fileName: a.fileName,
      fileSize: a.fileSize,
      createdAt: a.createdAt.toISOString(),
      url: await getLeadAttachmentSignedUrl(a.filePath),
      uploadedBy: a.uploadedBy,
    }))
  );

  return (
    <div className="space-y-6">
      <div>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 gap-1.5 text-muted-foreground">
          <Link href="/admin/crm">
            <ArrowLeft className="h-3.5 w-3.5" />
            CRM
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-semibold tracking-tight">{lead.fullName}</h1>
          <LeadStatusBadge status={lead.status} />
        </div>
        {lead.company && <p className="mt-1 text-sm text-muted-foreground">{lead.company}</p>}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <InfoRow icon={Mail} label="Email" value={lead.email} />
              <InfoRow icon={Phone} label="Téléphone" value={lead.phone} />
              <InfoRow icon={Building2} label="Entreprise" value={lead.company} />
              <InfoRow icon={Globe} label="Pays" value={lead.country} />
              <InfoRow icon={Languages} label="Langue" value={lead.locale === "fr" ? "Français" : "Anglais"} />
              <InfoRow icon={ArrowUpRight} label="Source" value={leadSourceLabel(lead.source)} />
              <InfoRow icon={Wallet} label="Budget indicatif" value={lead.budget ? `${lead.budget}${lead.currency ? ` ${lead.currency}` : ""}` : null} />
            </CardContent>
          </Card>

          {lead.projectDescription && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Description du besoin</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-sm text-muted-foreground">{lead.projectDescription}</p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Pièces jointes</CardTitle>
            </CardHeader>
            <CardContent>
              <AttachmentPanel leadId={lead.id} attachments={attachments} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Nouvelle note</CardTitle>
            </CardHeader>
            <CardContent>
              <NoteComposer leadId={lead.id} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Historique</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={activities} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
