"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadProjectDocumentFile, deleteProjectDocumentFile } from "@/lib/supabase/storage";

export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_DOCUMENT_SIZE = 20 * 1024 * 1024; // 20 Mo

export async function uploadProjectDocument(formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const projectId = String(formData.get("projectId") ?? "");
  const file = formData.get("file");

  if (!projectId) return { ok: false, error: "Sélectionnez un projet" };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Aucun fichier sélectionné" };
  if (file.size > MAX_DOCUMENT_SIZE) return { ok: false, error: "Fichier trop volumineux (20 Mo max)" };

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return { ok: false, error: "Projet introuvable" };

  try {
    const path = await uploadProjectDocumentFile(projectId, file);
    await db.document.create({
      data: { projectId, fileName: file.name, fileUrl: path, uploadedBy: user.fullName },
    });
  } catch (err) {
    console.error("[documents] upload failed:", err);
    return { ok: false, error: "L'envoi du document a échoué" };
  }

  revalidatePath("/admin/files");
  return { ok: true };
}

export async function deleteProjectDocument(documentId: string): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  const doc = await db.document.findUnique({ where: { id: documentId } });
  if (!doc) return { ok: false, error: "Document introuvable" };

  try {
    await deleteProjectDocumentFile(doc.fileUrl);
  } catch (err) {
    console.error("[documents] storage delete failed:", err);
  }
  await db.document.delete({ where: { id: documentId } });

  revalidatePath("/admin/files");
  return { ok: true };
}
