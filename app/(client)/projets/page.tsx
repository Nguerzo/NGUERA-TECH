import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { FolderOpen, FileText } from "lucide-react";
import Badge from "@/components/dashboard/Badge";
import EmptyState from "@/components/dashboard/EmptyState";
import { FadeInList, FadeInItem } from "@/components/dashboard/FadeIn";
import { PROJECT_STATUS } from "@/lib/statusMaps";

export default async function ProjetsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const isClient = user.role === "CLIENT";
  const projects = await db.project.findMany({
    where: isClient ? { clientId: user.id } : {},
    orderBy: { createdAt: "desc" },
    include: { documents: true },
  });

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="kicker">Suivi</span>
        <h2>Mes projets</h2>
      </div>

      {projects.length === 0 ? (
        <EmptyState icon={FolderOpen}>Aucun projet à afficher pour le moment.</EmptyState>
      ) : (
        <FadeInList style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {projects.map((p) => (
            <FadeInItem key={p.id}>
              <div className="dash-panel" style={{ padding: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
                  <div>
                    <h3 style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 600, marginBottom: 8 }}>
                      {p.title}
                    </h3>
                    <p style={{ fontSize: 14, color: "var(--ivory-dim)", maxWidth: 520 }}>{p.description}</p>
                  </div>
                  <Badge variant={PROJECT_STATUS[p.status]?.variant ?? "neutral"}>{PROJECT_STATUS[p.status]?.label ?? p.status}</Badge>
                </div>

                <div style={{ display: "flex", gap: 32, marginTop: 22, fontSize: 13, color: "var(--ivory-faint)" }}>
                  <span>Début : {p.dateDebut ? new Date(p.dateDebut).toLocaleDateString("fr-FR") : "—"}</span>
                  <span>Livraison : {p.dateLivraison ? new Date(p.dateLivraison).toLocaleDateString("fr-FR") : "—"}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FileText size={13} /> {p.documents.length} document(s)
                  </span>
                </div>
              </div>
            </FadeInItem>
          ))}
        </FadeInList>
      )}
    </div>
  );
}
