import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanySettingsForm } from "@/components/portal/settings/CompanySettingsForm";
import { UserRoleSelect } from "@/components/portal/settings/UserRoleSelect";

export const metadata = { title: "Paramètres — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

function initials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("");
}

const ROLE_DESCRIPTION: Record<string, string> = {
  ADMIN: "Accès complet : paramètres, utilisateurs, toutes les données.",
  TEAM: "Accès au portail interne (CRM, projets, devis, factures...) sans gestion des utilisateurs.",
  CLIENT: "Accès en lecture seule à son propre espace (projets, factures).",
};

export default async function SettingsPage() {
  const currentUser = await getCurrentUser();
  const [settings, users] = await Promise.all([
    db.companySettings.upsert({ where: { id: "default" }, create: { id: "default" }, update: {} }),
    db.user.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const isAdmin = currentUser?.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Paramètres</h1>
      </div>

      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Entreprise</TabsTrigger>
          <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Informations de l&apos;entreprise</CardTitle>
            </CardHeader>
            <CardContent>
              {isAdmin ? (
                <CompanySettingsForm
                  settings={{
                    companyName: settings.companyName,
                    companyEmail: settings.companyEmail,
                    companyPhone: settings.companyPhone,
                    defaultCurrency: settings.defaultCurrency,
                  }}
                />
              ) : (
                <p className="text-sm text-muted-foreground">Seul un administrateur peut modifier ces paramètres.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Utilisateurs ({users.length})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {users.map((u) => (
                <div key={u.id} className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="h-7 w-7">
                      <AvatarFallback className="text-[11px]">{initials(u.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{u.fullName}</p>
                      <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                    </div>
                  </div>
                  {isAdmin ? (
                    <UserRoleSelect userId={u.id} initialRole={u.role} disabled={u.id === currentUser?.id} />
                  ) : (
                    <span className="text-xs text-muted-foreground">{u.role}</span>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Rôles et permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(ROLE_DESCRIPTION).map(([role, description]) => (
                <div key={role} className="rounded-md border px-3 py-2.5">
                  <p className="text-sm font-medium">{role === "ADMIN" ? "Administrateur" : role === "TEAM" ? "Équipe" : "Client"}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Le rôle d&apos;un utilisateur se change depuis l&apos;onglet Utilisateurs.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
