"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { uploadContractFile, deleteContractFile } from "@/lib/supabase/storage";
import type { ContractStatus } from "@prisma/client";

export type ActionResult = { ok: true } | { ok: false; error: string };

const MAX_CONTRACT_SIZE = 20 * 1024 * 1024; // 20 Mo
const CONTRACT_STATUSES = ["BROUILLON", "ENVOYE", "SIGNE"] as const;

export async function uploadContract(formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const title = String(formData.get("title") ?? "").trim();
  const clientId = String(formData.get("clientId") ?? "");
  const projectId = String(formData.get("projectId") ?? "") || null;
  const file = formData.get("file");

  if (!title) return { ok: false, error: "Titre requis" };
  if (!clientId) return { ok: false, error: "Sélectionnez un client" };
  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Aucun fichier sélectionné" };
  if (file.size > MAX_CONTRACT_SIZE) return { ok: false, error: "Fichier trop volumineux (20 Mo max)" };

  const client = await db.user.findUnique({ where: { id: clientId } });
  if (!client || client.role !== "CLIENT") return { ok: false, error: "Client introuvable" };

  try {
    const path = await uploadContractFile(clientId, file);
    await db.contract.create({
      data: {
        title,
        clientId,
        projectId,
        fileName: file.name,
        filePath: path,
        fileSize: file.size,
        contentType: file.type || "application/octet-stream",
        uploadedById: user.id,
      },
    });
  } catch (err) {
    console.error("[contracts] upload failed:", err);
    return { ok: false, error: "L'envoi du contrat a échoué" };
  }

  revalidatePath("/admin/contracts");
  return { ok: true };
}

export async function updateContractStatus(contractId: string, status: ContractStatus): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  if (!CONTRACT_STATUSES.includes(status)) {
    return { ok: false, error: "Statut invalide" };
  }

  await db.contract.update({
    where: { id: contractId },
    data: { status, signedAt: status === "SIGNE" ? new Date() : null },
  });

  revalidatePath("/admin/contracts");
  return { ok: true };
}

export async function deleteContract(contractId: string): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  const contract = await db.contract.findUnique({ where: { id: contractId } });
  if (!contract) return { ok: false, error: "Contrat introuvable" };

  try {
    await deleteContractFile(contract.filePath);
  } catch (err) {
    console.error("[contracts] storage delete failed:", err);
  }
  await db.contract.delete({ where: { id: contractId } });

  revalidatePath("/admin/contracts");
  return { ok: true };
}
