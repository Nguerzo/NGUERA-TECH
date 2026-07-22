import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { db } from "./db";
import type { Role } from "@prisma/client";

/**
 * Récupère l'utilisateur connecté (session Supabase) ainsi que sa fiche métier
 * (rôle, entreprise, etc.) stockée dans la table User via Prisma.
 * Retourne null si personne n'est connecté — ne redirige pas, pour rester
 * utilisable aussi bien dans une page publique que protégée.
 */
export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) return null;

  const profile = await db.user.findUnique({ where: { id: authUser.id } });
  if (!profile) return null;

  return profile;
}

/**
 * À appeler en haut de toute page/segment protégé.
 * Redirige vers /login si personne n'est connecté, et vers /dashboard
 * si le rôle ne correspond pas à ce qui est requis (plutôt qu'une simple
 * erreur 403 opaque).
 */
export async function requireRole(allowed: Role[]) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!allowed.includes(user.role)) {
    redirect("/dashboard");
  }

  return user;
}
