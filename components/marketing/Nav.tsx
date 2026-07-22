"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/Logo";

const LINKS = [
  { href: "/", label: "Accueil" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/a-propos", label: "À propos" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav>
      <div className="logo">
        <LogoMark size={24} />
        NGUERA
        <span style={{ color: "var(--ivory-faint)", fontWeight: 500 }}>·TECH</span>
      </div>
      <div className="nav-links">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={pathname === link.href ? "active" : ""}>
            {link.label}
          </Link>
        ))}
      </div>
      <Link href="/contact" className="nav-cta">
        Demander un devis
      </Link>
    </nav>
  );
}
