"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { QuoteStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateQuoteStatus } from "@/app/actions/quotes";
import { QUOTE_STATUS_LABEL, QUOTE_STATUS_ORDER } from "@/lib/quotes/labels";

export function QuoteStatusSelect({ quoteId, initialStatus }: { quoteId: string; initialStatus: QuoteStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(next: QuoteStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateQuoteStatus(quoteId, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.error);
      }
    });
  }

  return (
    <Select value={status} onValueChange={(v) => handleChange(v as QuoteStatus)} disabled={pending}>
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {QUOTE_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {QUOTE_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
