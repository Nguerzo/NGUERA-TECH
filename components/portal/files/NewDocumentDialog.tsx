"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { uploadProjectDocument } from "@/app/actions/documents";

export function NewDocumentDialog({ projects }: { projects: { id: string; title: string }[] }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await uploadProjectDocument(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Document ajouté");
      setOpen(false);
      formRef.current?.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5" disabled={projects.length === 0}>
          <Plus className="h-4 w-4" />
          Ajouter un fichier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un document</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="projectId">Projet</Label>
            <Select name="projectId" required>
              <SelectTrigger id="projectId">
                <SelectValue placeholder="Sélectionner un projet" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="file">Fichier</Label>
            <input
              id="file"
              name="file"
              type="file"
              required
              className="w-full text-xs file:mr-2 file:rounded-md file:border-0 file:bg-secondary file:px-2 file:py-1 file:text-xs"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Envoi…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
