"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProjectDocument } from "@/app/actions/documents";

export function DeleteDocumentButton({ documentId }: { documentId: string }) {
  const [deleting, setDeleting] = useState(false);
  const [, startTransition] = useTransition();

  function handleDelete() {
    setDeleting(true);
    startTransition(async () => {
      const result = await deleteProjectDocument(documentId);
      if (!result.ok) {
        toast.error(result.error);
        setDeleting(false);
      }
    });
  }

  return (
    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" disabled={deleting} onClick={handleDelete}>
      <Trash2 className="h-3.5 w-3.5" />
    </Button>
  );
}
