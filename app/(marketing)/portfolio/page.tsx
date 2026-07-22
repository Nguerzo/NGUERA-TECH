import type { Metadata } from "next";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Portfolio — NGUERA SENEGALENSIS TECH",
  description: "Nos réalisations — cette page est en cours de constitution.",
};

const PLACEHOLDER_SLOTS = [
  "Site web / plateforme",
  "Application mobile",
  "Logiciel SaaS",
  "Dashboard & analytics",
  "Intégration IA",
  "Identité de marque",
];

export default function PortfolioPage() {
  return (
    <>
      <section className="hero-banner">
        <HorizonCanvas horizonRatio={0.85} baobabScale={0.7} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />
            NOS RÉALISATIONS
          </div>
          <h1>
            Le portfolio <em>arrive bientôt.</em>
          </h1>
          <p className="hero-sub">
            Nous documentons actuellement nos projets livrés — contexte, stack technique et résultats concrets.
            Chaque étude de cas sera publiée ici au fur et à mesure.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">En préparation</span>
            <h2>Ce que cette page contiendra.</h2>
          </Reveal>

          <Reveal
            className="grid-4"
            style={{ background: "transparent", border: "none", gap: 20 }}
          >
            {PLACEHOLDER_SLOTS.map((label) => (
              <div className="placeholder-card" key={label}>
                <div className="placeholder-icon">
                  <ImageOff />
                </div>
                <span className="placeholder-tag">À venir</span>
                <h3>{label}</h3>
                <p>Étude de cas en préparation pour cette catégorie.</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <Reveal className="wrap cta-box">
          <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
            Un projet en tête ?
          </span>
          <h2>En attendant, parlons du vôtre.</h2>
          <div className="cta-actions">
            <Link href="/contact" className="btn-primary">
              Demander un devis
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
