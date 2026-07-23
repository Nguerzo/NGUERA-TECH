import type { Metadata } from "next";
import "@/styles/portal.css";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { ThemeProvider } from "@/components/portal/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import PortalShell from "@/components/portal/PortalShell";
import type { NotificationItem } from "@/components/portal/NotificationBell";

export const metadata: Metadata = {
  title: "Portail — NGUERA SENEGALENSIS TECH",
  description: "Plateforme interne : CRM, projets, devis, facturation.",
};

// Toujours dynamique (auth + données par utilisateur) : évite que `next build`
// tente une pré-analyse statique qui ouvre une connexion DB pour rien.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Seuls ADMIN et TEAM accèdent au portail interne.
  const user = await requireRole(["ADMIN", "TEAM"]);

  const notificationRows = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
  const notifications: NotificationItem[] = notificationRows.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    link: n.link,
    read: n.read,
    createdAt: n.createdAt.toISOString(),
  }));

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="portal-root min-h-screen">
        <PortalShell userName={user.fullName} userRole={user.role} notifications={notifications}>
          {children}
        </PortalShell>
      </div>
      <Toaster />
    </ThemeProvider>
  );
}
