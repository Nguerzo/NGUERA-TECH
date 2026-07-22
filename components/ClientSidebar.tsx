"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, FolderKanban, Receipt, ShieldCheck, LogOut } from "lucide-react";
import LogoMark from "@/components/Logo";

const LINKS = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/projets", label: "Mes projets", icon: FolderKanban },
  { href: "/factures", label: "Mes factures", icon: Receipt },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

export default function ClientSidebar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const pathname = usePathname();

  return (
    <motion.aside
      className="dash-sidebar"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="logo" style={{ marginBottom: 8 }}>
        <LogoMark size={22} /> NGUERA·TECH
      </div>
      <span className="dash-badge-kicker">Espace client</span>

      <nav className="dash-nav">
        {LINKS.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} className={`dash-nav-link${active ? " active" : ""}`}>
              <Icon />
              {link.label}
            </Link>
          );
        })}
        {(userRole === "ADMIN" || userRole === "TEAM") && (
          <div className="dash-nav-secondary">
            <Link href="/admin" className="dash-nav-link">
              <ShieldCheck />
              Back-office admin
            </Link>
          </div>
        )}
      </nav>

      <div className="dash-user">
        <div className="dash-user-row">
          <div className="dash-avatar">{initials(userName)}</div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 13.5 }}>{userName}</div>
            <span className={`dash-role-badge${userRole === "ADMIN" ? " admin" : userRole === "TEAM" ? " team" : ""}`}>
              {userRole}
            </span>
          </div>
        </div>
        <form action="/api/auth/signout" method="post" style={{ marginTop: 16 }}>
          <button type="submit" className="btn-ghost" style={{ width: "100%", fontSize: 13, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <LogOut size={14} />
            Se déconnecter
          </button>
        </form>
      </div>
    </motion.aside>
  );
}
