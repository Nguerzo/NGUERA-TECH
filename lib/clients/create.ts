import "server-only";
import { db } from "@/lib/db";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CreateClientInput = {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  phone?: string;
};

export type CreateClientResult = { ok: true; userId: string } | { ok: false; error: string };

/**
 * Shared by the manual "new client" form and the CRM lead-conversion flow —
 * creates the Supabase Auth account and the matching business row together,
 * rolling back the Auth account if the User row fails so we never leave an
 * orphaned login with no profile.
 */
export async function createClientUser(input: CreateClientInput): Promise<CreateClientResult> {
  const supabaseAdmin = createSupabaseAdminClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: input.email,
    password: input.password,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return { ok: false, error: authError?.message ?? "Impossible de créer le compte Supabase Auth." };
  }

  try {
    await db.user.create({
      data: {
        id: authData.user.id,
        email: input.email,
        fullName: input.fullName,
        role: "CLIENT",
        companyName: input.companyName || null,
        phone: input.phone || null,
      },
    });
  } catch {
    await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
    return { ok: false, error: "Cet email a déjà une fiche client, ou une erreur base de données est survenue." };
  }

  return { ok: true, userId: authData.user.id };
}
