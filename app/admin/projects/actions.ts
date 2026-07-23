"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import type { ProjectStatus } from "@prisma/client";

const PROJECT_STATUSES = ["ANALYSE", "DEVELOPPEMENT", "TESTS", "LIVRAISON", "MAINTENANCE"] as const;

const createProjectSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client"),
  title: z.string().min(2, "Titre requis"),
  description: z.string().min(1, "Description requise"),
  status: z.enum(PROJECT_STATUSES).default("ANALYSE"),
  budgetEstime: z.coerce.number().positive().or(z.literal("").transform(() => undefined)),
  dateDebut: z.string().optional(),
  dateLivraison: z.string().optional(),
});

export type CreateProjectState = { error?: string; success?: boolean };

export async function createProject(
  _prevState: CreateProjectState,
  formData: FormData
): Promise<CreateProjectState> {
  await requireRole(["ADMIN", "TEAM"]);

  const parsed = createProjectSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    description: formData.get("description"),
    status: formData.get("status") || "DEVIS",
    budgetEstime: formData.get("budgetEstime") || "",
    dateDebut: formData.get("dateDebut") || undefined,
    dateLivraison: formData.get("dateLivraison") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { clientId, title, description, status, budgetEstime, dateDebut, dateLivraison } = parsed.data;

  const client = await db.user.findUnique({ where: { id: clientId } });
  if (!client || client.role !== "CLIENT") {
    return { error: "Client introuvable." };
  }

  await db.project.create({
    data: {
      clientId,
      title,
      description,
      status,
      budgetEstime,
      dateDebut: dateDebut ? new Date(dateDebut) : undefined,
      dateLivraison: dateLivraison ? new Date(dateLivraison) : undefined,
    },
  });

  revalidatePath("/admin/projects");
  return { success: true };
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateProjectStatus(projectId: string, status: ProjectStatus): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  if (!PROJECT_STATUSES.includes(status)) {
    return { ok: false, error: "Statut invalide" };
  }

  await db.project.update({ where: { id: projectId }, data: { status } });

  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${projectId}`);
  return { ok: true };
}
