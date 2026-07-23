import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { NewProjectDialog } from "@/components/portal/projects/NewProjectDialog";
import { ProjectStatusSelect } from "@/components/portal/projects/ProjectStatusSelect";

export const metadata = { title: "Projets — Portail NGUERA SENEGALENSIS TECH" };
export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const [projects, clients] = await Promise.all([
    db.project.findMany({ orderBy: { createdAt: "desc" }, include: { client: true } }),
    db.user.findMany({ where: { role: "CLIENT" }, orderBy: { fullName: "asc" }, select: { id: true, fullName: true, email: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Portail interne</p>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Projets</h1>
        </div>
        <NewProjectDialog clients={clients} />
      </div>

      {projects.length === 0 ? (
        <div className="rounded-lg border border-dashed py-16 text-center text-sm text-muted-foreground">
          {clients.length === 0
            ? "Créez d'abord un client avant de pouvoir lui associer un projet."
            : "Aucun projet pour le moment."}
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex items-start justify-between gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <Link href={`/admin/projects/${p.id}`} className="text-sm font-medium hover:text-primary">
                    {p.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {p.client.fullName} — {p.client.email}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
                </div>
                <ProjectStatusSelect projectId={p.id} initialStatus={p.status} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
