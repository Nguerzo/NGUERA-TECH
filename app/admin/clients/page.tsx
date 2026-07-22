import { db } from "@/lib/db";
import ClientForm from "./ClientForm";
import { Users, FolderKanban, Receipt } from "lucide-react";
import EmptyState from "@/components/dashboard/EmptyState";
import { FadeInList, FadeInItem } from "@/components/dashboard/FadeIn";

export default async function AdminClientsPage() {
  const clients = await db.user.findMany({
    where: { role: "CLIENT" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { projects: true, invoices: true } } },
  });

  return (
    <div>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="kicker">Back-office</span>
        <h2>Clients</h2>
      </div>

      <div className="dash-panel" style={{ padding: 32, marginBottom: 48, maxWidth: 640 }}>
        <h3 style={{ fontFamily: "var(--display)", fontSize: 17, fontWeight: 600, marginBottom: 20 }}>
          Nouveau client
        </h3>
        <ClientForm />
      </div>

      {clients.length === 0 ? (
        <EmptyState icon={Users}>Aucun client pour le moment.</EmptyState>
      ) : (
        <FadeInList className="dash-panel" style={{ overflow: "hidden" }}>
          {clients.map((c, i) => (
            <FadeInItem key={c.id}>
              <div
                style={{
                  padding: "18px 22px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderTop: i === 0 ? "none" : "1px solid var(--glass-border)",
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5 }}>{c.fullName}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ivory-faint)", marginTop: 2 }}>
                    {c.email} {c.companyName ? `— ${c.companyName}` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 18, fontSize: 12.5, color: "var(--ivory-dim)", fontFamily: "var(--mono)" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <FolderKanban size={13} /> {c._count.projects}
                  </span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Receipt size={13} /> {c._count.invoices}
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
