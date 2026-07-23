"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createQuoteSchema, quoteStatusValues } from "@/lib/validation/quotes";
import { notifyStaff } from "@/lib/notifications/create";
import type { QuoteStatus } from "@prisma/client";

export type ActionResult = { ok: true; id?: string } | { ok: false; error: string };

async function nextQuoteNumber() {
  const year = new Date().getFullYear();
  const count = await db.quote.count({ where: { number: { startsWith: `DEV-${year}-` } } });
  return `DEV-${year}-${String(count + 1).padStart(4, "0")}`;
}

export async function createQuote(_prevState: ActionResult, formData: FormData): Promise<ActionResult> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    return { ok: false, error: "Lignes de devis invalides" };
  }

  const parsed = createQuoteSchema.safeParse({
    clientId: formData.get("clientId"),
    projectId: formData.get("projectId") || undefined,
    currency: formData.get("currency"),
    validUntil: formData.get("validUntil") || undefined,
    notes: formData.get("notes") || "",
    items,
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;

  const client = await db.user.findUnique({ where: { id: data.clientId } });
  if (!client || client.role !== "CLIENT") {
    return { ok: false, error: "Client introuvable" };
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const number = attempt === 0 ? await nextQuoteNumber() : `${await nextQuoteNumber()}-${Date.now()}`;
    try {
      const quote = await db.quote.create({
        data: {
          number,
          clientId: data.clientId,
          projectId: data.projectId || null,
          currency: data.currency,
          validUntil: data.validUntil ? new Date(data.validUntil) : null,
          notes: data.notes || null,
          createdById: user.id,
          items: {
            create: data.items.map((item, i) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              position: i,
            })),
          },
        },
      });
      revalidatePath("/admin/quotes");
      await notifyStaff({
        title: "Devis créé",
        message: `${quote.number} pour ${client.fullName}`,
        link: `/admin/quotes/${quote.id}`,
      });
      return { ok: true, id: quote.id };
    } catch (err) {
      const isUniqueConflict = typeof err === "object" && err !== null && "code" in err && err.code === "P2002";
      if (!isUniqueConflict) {
        console.error("[quotes] create failed:", err);
        return { ok: false, error: "Impossible de créer le devis" };
      }
    }
  }

  return { ok: false, error: "Impossible de générer un numéro de devis unique, réessayez" };
}

export async function updateQuoteStatus(quoteId: string, status: QuoteStatus): Promise<ActionResult> {
  await requireRole(["ADMIN", "TEAM"]);

  if (!quoteStatusValues.includes(status)) {
    return { ok: false, error: "Statut invalide" };
  }

  await db.quote.update({ where: { id: quoteId }, data: { status } });

  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${quoteId}`);
  return { ok: true };
}
