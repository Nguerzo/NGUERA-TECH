"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { manualLeadSchema, noteSchema, leadStatusValues } from "@/lib/validation/crm";
import { uploadLeadAttachment, deleteLeadAttachment } from "@/lib/supabase/storage";
import type { LeadStatus } from "@prisma/client";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createManualLead(formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: String(formData.get("email") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    country: String(formData.get("country") ?? ""),
    locale: String(formData.get("locale") ?? "en"),
    source: String(formData.get("source") ?? "manuel"),
    budget: String(formData.get("budget") ?? ""),
    currency: String(formData.get("currency") ?? "") || undefined,
    projectDescription: String(formData.get("projectDescription") ?? ""),
  };

  const parsed = manualLeadSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;

  const lead = await db.lead.create({
    data: {
      fullName: data.fullName,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      country: data.country || null,
      locale: data.locale,
      source: data.source,
      budget: data.budget || null,
      currency: data.currency ?? null,
      projectDescription: data.projectDescription || null,
      gdprConsent: true, // saisie manuelle par l'équipe — le consentement a été recueilli hors-ligne
    },
  });

  await db.leadActivity.create({
    data: {
      leadId: lead.id,
      type: "NOTE",
      content: `Prospect ajouté manuellement par ${user.fullName}.`,
      authorId: user.id,
    },
  });

  revalidatePath("/admin/crm");
  return { ok: true };
}

export async function updateLeadStatus(leadId: string, newStatus: LeadStatus): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  if (!leadStatusValues.includes(newStatus)) {
    return { ok: false, error: "Statut invalide" };
  }

  const lead = await db.lead.findUnique({ where: { id: leadId }, select: { status: true } });
  if (!lead) return { ok: false, error: "Prospect introuvable" };
  if (lead.status === newStatus) return { ok: true };

  await db.$transaction([
    db.lead.update({ where: { id: leadId }, data: { status: newStatus } }),
    db.leadActivity.create({
      data: {
        leadId,
        type: "STATUS_CHANGE",
        oldStatus: lead.status,
        newStatus,
        authorId: user.id,
      },
    }),
  ]);

  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${leadId}`);
  return { ok: true };
}

export async function addLeadNote(leadId: string, formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const parsed = noteSchema.safeParse({ content: formData.get("content") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Note invalide" };
  }

  await db.leadActivity.create({
    data: {
      leadId,
      type: "NOTE",
      content: parsed.data.content,
      authorId: user.id,
    },
  });

  revalidatePath(`/admin/crm/${leadId}`);
  return { ok: true };
}

const MAX_ATTACHMENT_SIZE = 15 * 1024 * 1024; // 15 Mo

export async function uploadLeadAttachmentAction(leadId: string, formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: "Aucun fichier sélectionné" };
  }
  if (file.size > MAX_ATTACHMENT_SIZE) {
    return { ok: false, error: "Fichier trop volumineux (15 Mo max)" };
  }

  try {
    const path = await uploadLeadAttachment(leadId, file);

    await db.$transaction([
      db.leadAttachment.create({
        data: {
          leadId,
          fileName: file.name,
          filePath: path,
          fileSize: file.size,
          contentType: file.type || "application/octet-stream",
          uploadedById: user.id,
        },
      }),
      db.leadActivity.create({
        data: {
          leadId,
          type: "ATTACHMENT",
          content: file.name,
          authorId: user.id,
        },
      }),
    ]);
  } catch (err) {
    console.error("[crm] attachment upload failed:", err);
    return { ok: false, error: "L'envoi du fichier a échoué" };
  }

  revalidatePath(`/admin/crm/${leadId}`);
  return { ok: true };
}

export async function deleteLeadAttachmentAction(attachmentId: string): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  const attachment = await db.leadAttachment.findUnique({ where: { id: attachmentId } });
  if (!attachment) return { ok: false, error: "Pièce jointe introuvable" };

  try {
    await deleteLeadAttachment(attachment.filePath);
  } catch (err) {
    console.error("[crm] attachment storage delete failed:", err);
  }
  await db.leadAttachment.delete({ where: { id: attachmentId } });

  revalidatePath(`/admin/crm/${attachment.leadId}`);
  return { ok: true };
}
