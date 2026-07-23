import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, KeyRound, Clock } from "lucide-react";

export const metadata = { title: "Sécurité — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  const currentUser = await requireRole(["ADMIN", "TEAM"]);
  const isAdmin = currentUser.role === "ADMIN";

  const [logs, authUser] = await Promise.all([
    isAdmin
      ? db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50, include: { actor: { select: { fullName: true } } } })
      : Promise.resolve([]),
    createSupabaseAdminClient()
      .auth.admin.getUserById(currentUser.id)
      .then((r) => r.data.user)
      .catch(() => null),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Sécurité</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <KeyRound className="h-4 w-4" />
              Authentification à deux facteurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              PAS ENCORE ACTIVÉ
            </Badge>
            <p className="text-sm text-muted-foreground">
              L&apos;infrastructure d&apos;authentification (Supabase Auth) prend en charge la 2FA (TOTP) nativement.
              L&apos;activation par utilisateur n&apos;est pas encore câblée dans cette interface — c&apos;est la
              prochaine étape logique de ce module, pas une fonctionnalité en place aujourd&apos;hui.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Votre session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dernière connexion</span>
              <span className="font-medium">
                {authUser?.last_sign_in_at
                  ? new Date(authUser.last_sign_in_at).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })
                  : "—"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              La gestion détaillée des sessions actives (par appareil, révocation individuelle) n&apos;est pas encore
              disponible dans cette interface.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <ShieldAlert className="h-4 w-4" />
            Journal d&apos;audit {isAdmin ? `(${logs.length})` : ""}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!isAdmin ? (
            <p className="py-6 text-center text-sm text-muted-foreground">Réservé aux administrateurs.</p>
          ) : logs.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Aucune action sensible enregistrée pour le moment — création de compte client, conversion de
              prospect, changement de rôle et mise à jour des paramètres apparaîtront ici.
            </p>
          ) : (
            <ul className="divide-y">
              {logs.map((log) => (
                <li key={log.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <div className="min-w-0">
                    <p className="truncate">
                      <span className="font-medium">{log.actor.fullName}</span> — {log.action}
                      {log.detail ? ` — ${log.detail}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {log.createdAt.toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
