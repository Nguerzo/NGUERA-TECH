"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { createClientUser } from "@/lib/clients/create";
import { logAudit } from "@/lib/audit/log";

const createClientSchema = z.object({
  email: z.string().email("Adresse email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  fullName: z.string().min(2, "Nom requis"),
  companyName: z.string().optional(),
  phone: z.string().optional(),
});

export type CreateClientState = { error?: string; success?: boolean };

export async function createClientAccount(
  _prevState: CreateClientState,
  formData: FormData
): Promise<CreateClientState> {
  const actor = await requireRole(["ADMIN", "TEAM"]);

  const parsed = createClientSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName") || undefined,
    phone: formData.get("phone") || undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const result = await createClientUser(parsed.data);
  if (!result.ok) return { error: result.error };

  await logAudit({
    actorId: actor.id,
    action: "client.create",
    entityType: "User",
    entityId: result.userId,
    detail: `${parsed.data.fullName} (${parsed.data.email})`,
  });

  revalidatePath("/admin/clients");
  return { success: true };
}

const convertLeadSchema = z.object({
  leadId: z.string().min(1),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export type ConvertLeadState = { error?: string; success?: boolean };

export async function convertLeadToClient(
  _prevState: ConvertLeadState,
  formData: FormData
): Promise<ConvertLeadState> {
  const user = await requireRole(["ADMIN", "TEAM"]);

  const parsed = convertLeadSchema.safeParse({
    leadId: formData.get("leadId"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const lead = await db.lead.findUnique({ where: { id: parsed.data.leadId } });
  if (!lead) return { error: "Prospect introuvable" };
  if (lead.convertedClientId) return { error: "Ce prospect est déjà converti en client" };

  const result = await createClientUser({
    email: lead.email,
    password: parsed.data.password,
    fullName: lead.fullName,
    companyName: lead.company ?? undefined,
    phone: lead.phone ?? undefined,
  });
  if (!result.ok) return { error: result.error };

  await db.$transaction([
    db.lead.update({ where: { id: lead.id }, data: { convertedClientId: result.userId } }),
    db.leadActivity.create({
      data: {
        leadId: lead.id,
        type: "NOTE",
        content: `Converti en client par ${user.fullName}.`,
        authorId: user.id,
      },
    }),
  ]);

  await logAudit({
    actorId: user.id,
    action: "lead.convert_to_client",
    entityType: "Lead",
    entityId: lead.id,
    detail: `${lead.fullName} (${lead.email}) → client ${result.userId}`,
  });

  revalidatePath("/admin/clients");
  revalidatePath("/admin/crm");
  revalidatePath(`/admin/crm/${lead.id}`);
  return { success: true };
}
