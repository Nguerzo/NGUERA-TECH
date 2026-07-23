"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, Contact, Users, FolderKanban, FileText, Receipt, FileSignature, FolderOpen, CalendarDays, Settings, ShieldCheck, LogOut, Menu, ArrowLeft } from "lucide-react";
import LogoMark from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell, type NotificationItem } from "./NotificationBell";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/crm", label: "CRM", icon: Contact },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/projects", label: "Projets", icon: FolderKanban },
  { href: "/admin/quotes", label: "Devis", icon: FileText },
  { href: "/admin/invoices", label: "Factures", icon: Receipt },
  { href: "/admin/contracts", label: "Contrats", icon: FileSignature },
  { href: "/admin/files", label: "Fichiers", icon: FolderOpen },
  { href: "/admin/calendar", label: "Calendrier", icon: CalendarDays },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
  { href: "/admin/security", label: "Sécurité", icon: ShieldCheck },
];

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map((item) => {
        const Icon = item.icon;
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ userName, userRole, onNavigate }: { userName: string; userRole: string; pathname?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-1 py-2">
        <LogoMark size={22} />
        <span className="font-display text-sm font-semibold tracking-tight">NGUERA·TECH</span>
      </div>
      <Badge variant="secondary" className="mt-3 w-fit font-mono text-[10px] tracking-wide">
        PORTAIL INTERNE
      </Badge>

      <div className="mt-6 flex-1">
        <NavLinks pathname={pathname} onNavigate={onNavigate} />
      </div>

      <div className="mt-auto space-y-3 border-t pt-4">
        <Link href="/dashboard" onClick={onNavigate} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Vue espace client
        </Link>
        <div className="flex items-center gap-3 rounded-lg border bg-card px-3 py-2.5">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs">{initials(userName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole === "ADMIN" ? "Administrateur" : "Équipe"}</p>
          </div>
        </div>
        <form action="/api/auth/signout" method="post">
          <Button type="submit" variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground">
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function PortalShell({
  children,
  userName,
  userRole,
  notifications,
}: {
  children: React.ReactNode;
  userName: string;
  userRole: string;
  notifications: NotificationItem[];
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="hidden w-64 shrink-0 border-r bg-card/40 px-4 py-5 md:block"
      >
        <SidebarBody userName={userName} userRole={userRole} pathname={pathname} />
      </motion.aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between gap-3 border-b px-4 md:px-6">
          <div className="flex items-center gap-2 md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 px-4 py-5">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <SidebarBody userName={userName} userRole={userRole} onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>
            <div className="flex items-center gap-2">
              <LogoMark size={18} />
              <span className="font-display text-sm font-semibold">NGUERA·TECH</span>
            </div>
          </div>
          <div className="hidden md:block" />
          <div className="flex items-center gap-1">
            <NotificationBell notifications={notifications} />
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
