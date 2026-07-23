"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { deleteEvent } from "@/app/actions/calendar";

export function DeleteEventButton({ eventId }: { eventId: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-label="Supprimer l'événement"
      disabled={pending}
      className="shrink-0 opacity-60 hover:opacity-100 disabled:opacity-30"
      onClick={() =>
        startTransition(async () => {
          const result = await deleteEvent(eventId);
          if (!result.ok) toast.error(result.error);
        })
      }
    >
      <X className="h-3 w-3" />
    </button>
  );
}
