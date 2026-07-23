"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { ProjectStatus } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateProjectStatus } from "@/app/admin/projects/actions";
import { PROJECT_STATUS, PROJECT_STATUS_ORDER } from "@/lib/statusMaps";

export function ProjectStatusSelect({ projectId, initialStatus }: { projectId: string; initialStatus: ProjectStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const [pending, startTransition] = useTransition();

  function handleChange(next: ProjectStatus) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await updateProjectStatus(projectId, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.error);
      }
    });
  }

  return (
    <Select value={status} onValueChange={(v) => handleChange(v as ProjectStatus)} disabled={pending}>
      <SelectTrigger className="h-8 w-[150px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PROJECT_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s} className="text-xs">
            {PROJECT_STATUS[s].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
