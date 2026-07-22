import { db } from "@/lib/db";
import ProjectForm from "./ProjectForm";
import { FolderKanban } from "lucide-react";
import Badge from "@/components/dashboard/Badge";
import EmptyState from "@/components/dashboard/EmptyState";
import { FadeInList, FadeInItem } from "@/components/dashboard/FadeIn";
import { PROJECT_STATUS } from "@/lib/statusMaps";

export default async function AdminProjectsPage() {
  const [projects, clients] = await Promise.all([
    db.project.findMany({ orderBy: { createdAt: "desc" }, include: { client: true } }),
    db.user.findMany({ where: { role: "CLIENT" }, orderBy: { fullName: "asc" } }),
  ]);

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="kicker">Back-office</span>
        <h2>Projets</h2>
      </div>

      <div className="dash-panel" style={{ padding: 32, marginBottom: 48, maxWidth: 640 }}>
        <h3 style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
          Nouveau projet
        </h3>
        {clients.length === 0 ? (
          <p style={{ color: "var(--ivory-faint)", fontSize: 14 }}>
            Créez d'abord un client avant de pouvoir lui associer un projet.
          </p>
        ) : (
          <ProjectForm clients={clients} />
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderKanban}>Aucun projet pour le moment.</EmptyState>
      ) : (
        <FadeInList style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((p) => (
            <FadeInItem key={p.id}>
              <div className="dash-panel" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 600, marginBottom: 6 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "var(--ivory-faint)" }}>
                      {p.client.fullName} — {p.client.email}
                    </p>
                  </div>
                  <Badge variant={PROJECT_STATUS[p.status]?.variant ?? "neutral"}>
                    {PROJECT_STATUS[p.status]?.label ?? p.status}
                  </Badge>
                </div>
                <p style={{ fontSize: 14, color: "var(--ivory-dim)", maxWidth: 520, marginTop: 14 }}>{p.description}</p>
              </div>
            </FadeInItem>
          ))}
        </FadeInList>
      )}
    </div>
  );
}
