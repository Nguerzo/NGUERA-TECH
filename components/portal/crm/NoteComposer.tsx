"use client";

import { useRef } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { addLeadNote } from "@/app/actions/crm";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "Envoi…" : "Ajouter la note"}
    </Button>
  );
}

export function NoteComposer({ leadId }: { leadId: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  async function action(formData: FormData) {
    const result = await addLeadNote(leadId, formData);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={action} className="space-y-2">
      <Textarea name="content" placeholder="Ajouter une note…" rows={3} required />
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
