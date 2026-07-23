"use client";

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { convertLeadToClient, type ConvertLeadState } from "@/app/admin/clients/actions";

const INITIAL: ConvertLeadState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Conversion…" : "Convertir en client"}
    </Button>
  );
}

export function ConvertLeadDialog({ leadId, fullName, email }: { leadId: string; fullName: string; email: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(convertLeadToClient, INITIAL);

  useEffect(() => {
    if (state.success && open) {
      setOpen(false);
      toast.success(`${fullName} est maintenant client.`);
    }
    if (state.error) toast.error(state.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-1.5">
          <UserPlus className="h-3.5 w-3.5" />
          Convertir
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Convertir {fullName} en client</DialogTitle>
          <DialogDescription>
            Crée un compte de connexion pour {email}. Le nom, l&apos;entreprise et le téléphone sont repris du prospect.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="leadId" value={leadId} />
          <div className="space-y-1.5">
            <Label htmlFor="password">Mot de passe initial</Label>
            <Input id="password" name="password" required minLength={8} autoComplete="off" />
          </div>
          <DialogFooter>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
