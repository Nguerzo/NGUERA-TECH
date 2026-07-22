"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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
  await requireRole(["ADMIN", "TEAM"]);

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

  const { email, password, fullName, companyName, phone } = parsed.data;

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { error: authError?.message ?? "Impossible de créer le compte Supabase Auth." };
  }

  try {
    await db.user.create({
      data: { id: authData.user.id, email, fullName, role: "CLIENT", companyName, phone },
    });
  } catch (err) {
    // La fiche métier a échoué : on supprime le compte Auth orphelin pour ne pas
    // laisser un identifiant "vivant" sans ligne User correspondante.
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { error: "Cet email a déjà une fiche client, ou une erreur base de données est survenue." };
  }

  revalidatePath("/admin/clients");
  return { success: true };
}
