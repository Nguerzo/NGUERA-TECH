"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { z } from "zod";

export type ActionResult = { ok: true } | { ok: false; error: string };

const eventSchema = z.object({
  title: z.string().trim().min(1, "Titre requis").max(200),
  type: z.enum(["REUNION", "DEADLINE", "LIVRAISON"]),
  startAt: z.string().min(1, "Date requise"),
  endAt: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function createEvent(formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    startAt: formData.get("startAt"),
    endAt: formData.get("endAt") || undefined,
    projectId: formData.get("projectId") || undefined,
    description: formData.get("description") || "",
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;

  await db.calendarEvent.create({
    data: {
      title: data.title,
      type: data.type,
      startAt: new Date(data.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
      projectId: data.projectId || null,
      description: data.description || null,
      createdById: user.id,
    },
  });

  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function deleteEvent(eventId: string): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);
  await db.calendarEvent.delete({ where: { id: eventId } });
  revalidatePath("/admin/calendar");
  return { ok: true };
}
