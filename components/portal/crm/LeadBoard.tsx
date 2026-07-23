"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { LeadStatus } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER, leadSourceLabel } from "@/lib/crm/labels";
import { updateLeadStatus } from "@/app/actions/crm";
import { cn } from "@/lib/utils";

export type BoardLead = {
  id: string;
  fullName: string;
  company: string | null;
  email: string;
  country: string | null;
  budget: string | null;
  currency: string | null;
  source: string;
  status: LeadStatus;
  createdAt: string;
};

function LeadCard({ lead }: { lead: BoardLead }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState(lead.status);

  function handleStatusChange(next: LeadStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.error);
      } else {
        toast.success(`${lead.fullName} → ${LEAD_STATUS_LABEL[next]}`);
      }
    });
  }

  return (
    <Card className={cn("space-y-2.5 p-3.5 transition-opacity", pending && "opacity-60")}>
      <Link href={`/admin/crm/${lead.id}`} className="block space-y-1">
        <p className="text-sm font-medium leading-tight hover:text-primary">{lead.fullName}</p>
        {lead.company && <p className="truncate text-xs text-muted-foreground">{lead.company}</p>}
      </Link>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {lead.country && <span>{lead.country}</span>}
        {lead.budget && (
          <span>
            {lead.budget}
            {lead.currency ? ` ${lead.currency}` : ""}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 pt-1">
        <span className="truncate text-[11px] text-muted-foreground">{leadSourceLabel(lead.source)}</span>
        <Select value={status} onValueChange={(v) => handleStatusChange(v as LeadStatus)} disabled={pending}>
          <SelectTrigger className="h-7 w-[112px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {LEAD_STATUS_ORDER.map((s) => (
              <SelectItem key={s} value={s} className="text-xs">
                {LEAD_STATUS_LABEL[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}

export function LeadBoard({ leads }: { leads: BoardLead[] }) {
  const columns = LEAD_STATUS_ORDER.map((status) => ({
    status,
    leads: leads.filter((l) => l.status === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((col, i) => (
        <motion.div
          key={col.status}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.03 }}
          className="w-72 shrink-0"
        >
          <div className="mb-3 flex items-center justify-between px-1">
            <h3 className="text-sm font-medium">{LEAD_STATUS_LABEL[col.status]}</h3>
            <span className="text-xs text-muted-foreground">{col.leads.length}</span>
          </div>
          <div className="space-y-2.5 rounded-lg border border-dashed bg-muted/30 p-2 min-h-[120px]">
            {col.leads.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">Aucun prospect</p>
            ) : (
              col.leads.map((lead) => <LeadCard key={lead.id} lead={lead} />)
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
