"use client";

import { useRef, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Paperclip, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadLeadAttachmentAction, deleteLeadAttachmentAction } from "@/app/actions/crm";

export type AttachmentItem = {
  id: string;
  fileName: string;
  fileSize: number;
  createdAt: string;
  url: string;
  uploadedBy: { fullName: string };
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" size="sm" disabled={pending} className="gap-1.5">
      <Paperclip className="h-3.5 w-3.5" />
      {pending ? "Envoi…" : "Ajouter un fichier"}
    </Button>
  );
}

export function AttachmentPanel({ leadId, attachments }: { leadId: string; attachments: AttachmentItem[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  async function action(formData: FormData) {
    const result = await uploadLeadAttachmentAction(leadId, formData);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    formRef.current?.reset();
  }

  function handleDelete(id: string) {
    setDeletingId(id);
    startTransition(async () => {
      const result = await deleteLeadAttachmentAction(id);
      if (!result.ok) toast.error(result.error);
      setDeletingId(null);
    });
  }

  return (
    <div className="space-y-3">
      {attachments.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune pièce jointe.</p>
      ) : (
        <ul className="space-y-2">
          {attachments.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{a.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {formatSize(a.fileSize)} · {a.uploadedBy.fullName}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button asChild variant="ghost" size="icon" className="h-7 w-7">
                  <a href={a.url} target="_blank" rel="noopener noreferrer" download={a.fileName}>
                    <Download className="h-3.5 w-3.5" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive"
                  disabled={deletingId === a.id}
                  onClick={() => handleDelete(a.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form ref={formRef} action={action} className="flex items-center gap-2">
        <input ref={inputRef} type="file" name="file" required className="text-xs file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs" />
        <UploadButton />
      </form>
    </div>
  );
}
