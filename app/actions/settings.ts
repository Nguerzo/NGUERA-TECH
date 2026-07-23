"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { logAudit } from "@/lib/audit/log";
import type { Role } from "@prisma/client";

export type ActionResult = { ok: true } | { ok: false; error: string };

const companySettingsSchema = z.object({
  companyName: z.string().trim().min(1, "Nom requis").max(200),
  companyEmail: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  companyPhone: z.string().trim().max(40).optional().or(z.literal("")),
  defaultCurrency: z.enum(["GBP", "FCFA", "EUR", "USD"]),
});

export async function updateCompanySettings(formData: FormData): Promise<ActionResult> {
  const actor = await requireRole(["ADMIN"]);

  const parsed = companySettingsSchema.safeParse({
    companyName: formData.get("companyName"),
    companyEmail: formData.get("companyEmail") || "",
    companyPhone: formData.get("companyPhone") || "",
    defaultCurrency: formData.get("defaultCurrency"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide" };
  }
  const data = parsed.data;

  await db.companySettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      companyName: data.companyName,
      companyEmail: data.companyEmail || null,
      companyPhone: data.companyPhone || null,
      defaultCurrency: data.defaultCurrency,
    },
    update: {
      companyName: data.companyName,
      companyEmail: data.companyEmail || null,
      companyPhone: data.companyPhone || null,
      defaultCurrency: data.defaultCurrency,
    },
  });

  await logAudit({ actorId: actor.id, action: "settings.update_company", entityType: "CompanySettings" });

  revalidatePath("/admin/settings");
  return { ok: true };
}

const ROLES = ["CLIENT", "TEAM", "ADMIN"] as const;

export async function updateUserRole(userId: string, role: Role): Promise<ActionResult> {
  const actor = await requireRole(["ADMIN"]);

  if (!ROLES.includes(role)) {
    return { ok: false, error: "Rôle invalide" };
  }
  if (userId === actor.id) {
    return { ok: false, error: "Vous ne pouvez pas changer votre propre rôle" };
  }

  const target = await db.user.findUnique({ where: { id: userId } });
  if (!target) return { ok: false, error: "Utilisateur introuvable" };

  await db.user.update({ where: { id: userId }, data: { role } });

  await logAudit({
    actorId: actor.id,
    action: "user.role_change",
    entityType: "User",
    entityId: userId,
    detail: `${target.fullName}: ${target.role} → ${role}`,
  });

  revalidatePath("/admin/settings");
  return { ok: true };
}
