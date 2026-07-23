import type { LeadStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { LEAD_STATUS_LABEL, LEAD_STATUS_STYLE } from "@/lib/crm/labels";
import { cn } from "@/lib/utils";

export function LeadStatusBadge({ status, className }: { status: LeadStatus; className?: string }) {
  return (
    <Badge variant="secondary" className={cn("border-0 font-medium", LEAD_STATUS_STYLE[status], className)}>
      {LEAD_STATUS_LABEL[status]}
    </Badge>
  );
}
