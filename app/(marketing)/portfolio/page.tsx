import type { Metadata } from "next";
import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";
import portfolioEcommerce from "@/public/images/portfolio-ecommerce.png";
import serviceDashboard from "@/public/images/service-dashboard.png";
import serviceCybersecurite from "@/public/images/service-cybersecurite.png";
import serviceIa from "@/public/images/service-ia.png";
import serviceCloud from "@/public/images/service-cloud.png";
import serviceMobile from "@/public/images/service-mobile.png";

export const metadata: Metadata = {
  title: "Portfolio — NGUERA SENEGALENSIS TECH",
  description: "Projets de démonstration illustrant notre approche — pas des références clients.",
};

type DemoProject = {
  badge: "Projet Démonstration" | "Concept";
  title: string;
  desc: string;
  tags: string[];
  image: StaticImageData;
};

const PROJECTS: DemoProject[] = [
  {
    badge: "Projet Démonstration",
    title: "Boutique e-commerce",
    desc: "Illustration d'une plateforme e-commerce type : catalogue, panier, paiement mobile money, gestion des commandes.",
    tags: ["Next.js", "Stripe / Wave", "Multi-catégories"],
    image: portfolioEcommerce,
  },
  {
    badge: "Projet Démonstration",
    title: "Dashboard analytique SaaS",
    desc: "Exemple d'espace client avec suivi de projets, revenus et activité en temps réel — le type d'interface que nous construisons pour nos clients SaaS.",
    tags: ["Tableau de bord", "Temps réel", "Multi-utilisateurs"],
    image: serviceDashboard,
  },
  {
    badge: "Concept",
    title: "Plateforme de cybersécurité",
    desc: "Concept d'interface de supervision sécurité : détection des menaces, audit et conformité, pensé pour une équipe SOC.",
    tags: ["Audit", "Conformité", "Surveillance 24/7"],
    image: serviceCybersecurite,
  },
  {
    badge: "Concept",
    title: "Agents IA métiers",
    desc: "Illustration d'un agent IA connecté aux données d'une entreprise pour automatiser support, ventes ou analyse.",
    tags: ["OpenAI", "Anthropic", "Automatisation"],
    image: serviceIa,
  },
  {
    badge: "Concept",
    title: "Infrastructure cloud évolutive",
    desc: "Exemple d'architecture cloud pensée pour la haute disponibilité et la montée en charge progressive.",
    tags: ["Cloud", "CI/CD", "Scalabilité"],
    image: serviceCloud,
  },
  {
    badge: "Projet Démonstration",
    title: "Application mobile de suivi",
    desc: "Illustration d'une application mobile de tableau de bord avec statistiques et activité récente.",
    tags: ["iOS", "Android", "Cross-platform"],
    image: serviceMobile,
  },
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
            Notre approche, <em>en démonstration.</em>
          </h1>
          <p className="hero-sub">
            Ces projets sont des démonstrations et concepts créés pour illustrer notre travail — pas des
            références clients. Nos vraies études de cas seront publiées ici au fur et à mesure des livraisons.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal
            className="grid-3"
            style={{ background: "transparent", border: "none", gap: 24 }}
          >
            {PROJECTS.map((p) => (
              <div className="demo-card" key={p.title}>
                <Image src={p.image} alt={`${p.badge} — ${p.title}`} className="demo-card-img" sizes="380px" />
                <div className="demo-card-body">
                  <span className="demo-badge">{p.badge}</span>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                  <div className="service-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
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
          <h2>Faisons de votre projet notre prochaine vraie référence.</h2>
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
