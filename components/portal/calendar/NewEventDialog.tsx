"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { createEvent } from "@/app/actions/calendar";

export function NewEventDialog({
  projects,
  defaultDate,
}: {
  projects: { id: string; title: string }[];
  defaultDate?: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const result = await createEvent(formData);
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Événement ajouté");
      setOpen(false);
      formRef.current?.reset();
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Nouvel événement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ajouter un événement</DialogTitle>
        </DialogHeader>
        <form ref={formRef} action={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Titre</Label>
            <Input id="title" name="title" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="type">Type</Label>
              <Select name="type" defaultValue="REUNION">
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="REUNION">Réunion</SelectItem>
                  <SelectItem value="DEADLINE">Deadline</SelectItem>
                  <SelectItem value="LIVRAISON">Livraison</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startAt">Date</Label>
              <Input id="startAt" name="startAt" type="datetime-local" required defaultValue={defaultDate} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="projectId">Projet (optionnel)</Label>
            <Select name="projectId">
              <SelectTrigger id="projectId">
                <SelectValue placeholder="Aucun" />
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
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={2} />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Ajout…" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
