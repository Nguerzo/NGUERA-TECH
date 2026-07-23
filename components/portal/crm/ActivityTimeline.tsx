import { FileText, MessageSquare, ArrowRightLeft } from "lucide-react";
import { LEAD_STATUS_LABEL } from "@/lib/crm/labels";
import type { LeadActivityType, LeadStatus } from "@prisma/client";

export type TimelineActivity = {
  id: string;
  type: LeadActivityType;
  content: string | null;
  oldStatus: LeadStatus | null;
  newStatus: LeadStatus | null;
  createdAt: string;
  author: { fullName: string };
};

const ICON: Record<LeadActivityType, typeof MessageSquare> = {
  NOTE: MessageSquare,
  STATUS_CHANGE: ArrowRightLeft,
  ATTACHMENT: FileText,
};

function describe(activity: TimelineActivity): string {
  if (activity.type === "STATUS_CHANGE" && activity.newStatus) {
    return activity.oldStatus
      ? `${activity.author.fullName} a changé le statut : ${LEAD_STATUS_LABEL[activity.oldStatus]} → ${LEAD_STATUS_LABEL[activity.newStatus]}`
      : `${activity.author.fullName} a défini le statut : ${LEAD_STATUS_LABEL[activity.newStatus]}`;
  }
  if (activity.type === "ATTACHMENT") {
    return `${activity.author.fullName} a ajouté un fichier — ${activity.content}`;
  }
  return activity.content ?? "";
}

export function ActivityTimeline({ activities }: { activities: TimelineActivity[] }) {
  if (activities.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">Aucune activité pour le moment.</p>;
  }

  return (
    <ol className="space-y-4">
      {activities.map((activity) => {
        const Icon = ICON[activity.type];
        return (
          <li key={activity.id} className="flex gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0 flex-1 pb-1">
              <p className="text-sm leading-snug">{describe(activity)}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {activity.author.fullName} · {new Date(activity.createdAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
