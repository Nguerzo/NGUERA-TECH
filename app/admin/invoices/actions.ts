"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifyStaff } from "@/lib/notifications/create";
import type { InvoiceStatus } from "@prisma/client";

const INVOICE_STATUSES = ["BROUILLON", "ENVOYEE", "PAYEE", "EN_RETARD"] as const;

const createInvoiceSchema = z.object({
  projectId: z.string().min(1, "Sélectionnez un projet"),
  amount: z.coerce.number().positive("Le montant doit être positif"),
  currency: z.string().min(1).default("XOF"),
  status: z.enum(INVOICE_STATUSES).default("BROUILLON"),
  dueDate: z.string().min(1, "Date d'échéance requise"),
});

export type CreateInvoiceState = { error?: string; success?: boolean };

async function nextInvoiceNumber() {
  const year = new Date().getFullYear();
  const count = await db.invoice.count({ where: { number: { startsWith: `FAC-${year}-` } } });
  return `FAC-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createInvoice(
  _prevState: CreateInvoiceState,
  formData: FormData
): Promise<CreateInvoiceState> {
  await requireRole(["ADMIN", "TEAM"]);

  const parsed = createInvoiceSchema.safeParse({
    projectId: formData.get("projectId"),
    amount: formData.get("amount"),
    currency: formData.get("currency") || "XOF",
    status: formData.get("status") || "BROUILLON",
    dueDate: formData.get("dueDate"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { projectId, amount, currency, status, dueDate } = parsed.data;

  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) {
    return { error: "Projet introuvable." };
  }

  // Léger risque de collision sous forte concurrence (compte + 1) : on retente une fois
  // avec un numéro suffixé si la contrainte unique est violée.
  for (let attempt = 0; attempt < 2; attempt++) {
    const number = attempt === 0 ? await nextInvoiceNumber() : `${await nextInvoiceNumber()}-${Date.now()}`;
    try {
      await db.invoice.create({
        data: {
          number,
          projectId,
          clientId: project.clientId,
          amount,
          currency,
          status,
          dueDate: new Date(dueDate),
        },
      });
      revalidatePath("/admin/invoices");
      return { success: true };
    } catch (err: any) {
      if (err?.code !== "P2002") {
        return { error: "Impossible de créer la facture." };
      }
    }
  }

  return { error: "Impossible de générer un numéro de facture unique, réessayez." };
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function updateInvoiceStatus(invoiceId: string, status: InvoiceStatus): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  if (!INVOICE_STATUSES.includes(status)) {
    return { ok: false, error: "Statut invalide" };
  }

  const invoice = await db.invoice.update({
    where: { id: invoiceId },
    data: { status, paidAt: status === "PAYEE" ? new Date() : null },
    include: { client: true },
  });

  if (status === "PAYEE") {
    await notifyStaff({
      title: "Facture payée",
      message: `${invoice.number} — ${invoice.client.fullName}`,
      link: `/admin/invoices/${invoiceId}`,
    });
  }

  revalidatePath("/admin/invoices");
  revalidatePath(`/admin/invoices/${invoiceId}`);
  return { ok: true };
}
