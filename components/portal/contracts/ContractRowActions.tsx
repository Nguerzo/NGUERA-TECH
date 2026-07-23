"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import type { ContractStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateContractStatus, deleteContract } from "@/app/actions/contracts";
import { CONTRACT_STATUS_LABEL, CONTRACT_STATUS_ORDER } from "@/lib/contracts/labels";

export function ContractRowActions({ contractId, initialStatus }: { contractId: string; initialStatus: ContractStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [deleting, setDeleting] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleStatusChange(next: ContractStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateContractStatus(contractId, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.error);
      }
    });
  }

  function handleDelete() {
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteContract(contractId);
      if (!result.ok) {
        toast.error(result.error);
        setDeleting(false);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Select value={status} onValueChange={(v) => handleStatusChange(v as ContractStatus)} disabled={pending}>
        <SelectTrigger className="h-8 w-[120px] text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {CONTRACT_STATUS_ORDER.map((s) => (
            <SelectItem key={s} value={s} className="text-xs">
              {CONTRACT_STATUS_LABEL[s]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={deleting} onClick={handleDelete}>
        <Trash2 className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
