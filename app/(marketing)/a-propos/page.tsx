import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Code2, Palette, BrainCircuit, ShieldCheck } from "lucide-react";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";
import officePhoto from "@/public/images/office.png";

export const metadata: Metadata = {
  title: "À propos — NGUERA SENEGALENSIS TECH",
  description: "Qui sommes-nous — notre mission et les expertises de notre équipe.",
};

const EXPERTISE_AREAS = [
  { icon: Code2, role: "Développement", desc: "Web, mobile, logiciels métiers" },
  { icon: BrainCircuit, role: "Intelligence Artificielle", desc: "Agents IA, automatisation" },
  { icon: ShieldCheck, role: "Sécurité & Infrastructure", desc: "Cybersécurité, cloud, DevOps" },
  { icon: Palette, role: "Design & Marque", desc: "UX/UI, identité visuelle" },
];

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
        <div className="wrap contact-grid">
          <Reveal>
            <span className="kicker">Notre mission</span>
            <h2 style={{ marginBottom: 16 }}>
              Construire l'infrastructure numérique sur laquelle nos clients grandissent.
            </h2>
            <p className="section-sub" style={{ maxWidth: 520 }}>
              On ne livre pas un site ou une application isolée : on construit des fondations techniques et
              créatives pensées pour durer, avec la même exigence qu'un studio international et une connaissance
              fine du marché sénégalais et ouest-africain.
            </p>
          </Reveal>
          <Reveal className="hero-visual-frame">
            <Image
              src={officePhoto}
              alt="Espace de travail NGUERA SENEGALENSIS TECH — ambiance technologique avec vue sur la ville"
              sizes="(max-width: 960px) 90vw, 45vw"
              style={{ width: "100%", height: "auto" }}
            />
          </Reveal>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Notre équipe</span>
            <h2>Les expertises qui composent l'équipe.</h2>
            <p className="section-sub">
              Les profils individuels (noms, rôles, photos) seront publiés ici au fur et à mesure — voici les
              domaines que couvre notre équipe dès aujourd'hui.
            </p>
          </Reveal>

          <Reveal className="team-grid">
            {EXPERTISE_AREAS.map((area) => {
              const Icon = area.icon;
              return (
                <div className="team-card" key={area.role}>
                  <div className="tech-avatar">
                    <Icon />
                  </div>
                  <h4>{area.role}</h4>
                  <p>{area.desc}</p>
                </div>
              );
            })}
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
