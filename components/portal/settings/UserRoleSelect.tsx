"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import type { Role } from "@prisma/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/app/actions/settings";

const ROLE_LABEL: Record<Role, string> = { CLIENT: "Client", TEAM: "Équipe", ADMIN: "Administrateur" };

export function UserRoleSelect({ userId, initialRole, disabled }: { userId: string; initialRole: Role; disabled?: boolean }) {
  const [role, setRole] = useState(initialRole);
  const [pending, startTransition] = useTransition();

  function handleChange(next: Role) {
    const previous = role;
    setRole(next);
    startTransition(async () => {
      const result = await updateUserRole(userId, next);
      if (!result.ok) {
        setRole(previous);
        toast.error(result.error);
      } else {
        toast.success(`Rôle mis à jour — ${ROLE_LABEL[next]}`);
      }
    });
  }

  return (
    <Select value={role} onValueChange={(v) => handleChange(v as Role)} disabled={pending || disabled}>
      <SelectTrigger className="h-8 w-[140px] text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="CLIENT" className="text-xs">
          Client
        </SelectItem>
        <SelectItem value="TEAM" className="text-xs">
          Équipe
        </SelectItem>
        <SelectItem value="ADMIN" className="text-xs">
          Administrateur
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
