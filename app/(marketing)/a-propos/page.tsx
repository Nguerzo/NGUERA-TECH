import type { Metadata } from "next";
import Link from "next/link";
import { User } from "lucide-react";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "À propos — NGUERA SENEGALENSIS TECH",
  description: "Qui sommes-nous — notre mission et notre équipe.",
};

const TEAM_PLACEHOLDERS = 4;

export default function AProposPage() {
  return (
    <>
      <section className="hero-banner">
        <HorizonCanvas horizonRatio={0.85} baobabScale={0.7} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />À PROPOS
          </div>
          <h1>
            Une équipe, <em>une exigence.</em>
          </h1>
          <p className="hero-sub">
            NGUERA SENEGALENSIS TECH conçoit des plateformes IA, des logiciels et des produits digitaux de niveau
            mondial — depuis Dakar, pour le monde.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Notre mission</span>
            <h2>Construire l'infrastructure numérique sur laquelle nos clients grandissent.</h2>
            <p className="section-sub">
              On ne livre pas un site ou une application isolée : on construit des fondations techniques et
              créatives pensées pour durer, avec la même exigence qu'un studio international et une connaissance
              fine du marché sénégalais et ouest-africain.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Notre équipe</span>
            <h2>Les profils arrivent bientôt.</h2>
            <p className="section-sub">Cette section sera complétée avec les vrais membres de l'équipe — nom, rôle et photo.</p>
          </Reveal>

          <Reveal className="team-grid">
            {Array.from({ length: TEAM_PLACEHOLDERS }).map((_, i) => (
              <div className="team-card" key={i}>
                <div className="placeholder-avatar">
                  <User />
                </div>
                <h4>Nom à venir</h4>
                <p>Rôle à définir</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <Reveal className="wrap cta-box">
          <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
            Envie de collaborer ?
          </span>
          <h2>Parlons de votre projet.</h2>
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
