"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { InvoiceStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateInvoiceStatus } from "@/app/admin/invoices/actions";
import { INVOICE_STATUS_LABEL, INVOICE_STATUS_ORDER } from "@/lib/invoices/labels";

export function InvoiceStatusSelect({ invoiceId, initialStatus }: { invoiceId: string; initialStatus: InvoiceStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(next: InvoiceStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateInvoiceStatus(invoiceId, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.error);
      }
    });
  }

  return (
    <Select value={status} onValueChange={(v) => handleChange(v as InvoiceStatus)} disabled={pending}>
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {INVOICE_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {INVOICE_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
