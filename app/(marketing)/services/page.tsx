import type { Metadata } from "next";
import Link from "next/link";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";

export const metadata: Metadata = {
  title: "Services — NGUERA SENEGALENSIS TECH",
  description:
    "Développement web et mobile, intelligence artificielle, SaaS, cybersécurité, cloud et branding — l'ensemble de nos services.",
};

const DEV_SERVICES = [
  {
    num: "01",
    title: "Sites web & plateformes",
    desc: "Sites vitrines, sites institutionnels, plateformes e-commerce et marketplaces — conçus pour convertir et tenir la charge.",
    tags: ["Next.js", "SEO technique", "E-commerce", "Multilingue"],
  },
  {
    num: "02",
    title: "Applications mobiles",
    desc: "Applications iOS et Android, natives ou cross-platform, connectées à vos systèmes existants.",
    tags: ["iOS", "Android", "Cross-platform", "Notifications push"],
  },
  {
    num: "03",
    title: "Logiciels métiers & ERP/CRM",
    desc: "Outils sur mesure pour piloter votre activité : gestion clients, stocks, facturation, ressources humaines.",
    tags: ["CRM", "ERP", "Facturation", "Multi-utilisateurs"],
  },
  {
    num: "04",
    title: "Logiciels SaaS & marketplaces",
    desc: "Produits SaaS multi-clients avec abonnements, rôles et permissions, et tableau de bord dédié.",
    tags: ["Multi-tenant", "Abonnements", "API", "Dashboard client"],
  },
];

const AI_CARDS = [
  { title: "Agents IA métiers", desc: "Assistants spécialisés (commercial, support, technique) connectés à vos données réelles." },
  { title: "Chatbots", desc: "Réponse client automatisée sur votre site, WhatsApp ou vos réseaux, avec escalade humaine si besoin." },
  { title: "Automatisation intelligente", desc: "Workflows qui déclenchent emails, relances et mises à jour sans intervention manuelle." },
  { title: "Intégrations API IA", desc: "OpenAI, Anthropic, Gemini, Mistral — la brique adaptée à chaque usage, pas une seule pour tout faire." },
];

const INFRA_CARDS = [
  { title: "Cybersécurité", desc: "Authentification forte, 2FA, chiffrement, protections CSRF/XSS/injection, journalisation des accès." },
  { title: "Cloud & DevOps", desc: "Infrastructure évolutive, sauvegardes automatiques, déploiement continu, supervision en temps réel." },
  { title: "Maintenance & support", desc: "Corrections, mises à jour de sécurité et évolutions après la mise en ligne — un produit vivant, pas livré puis abandonné." },
];

const DESIGN_CARDS = [
  { title: "Branding & identité", desc: "Logo, charte graphique, ton de marque — une identité cohérente sur tous vos supports." },
  { title: "UX/UI Design", desc: "Interfaces pensées pour vos utilisateurs réels, pas pour impressionner un portfolio." },
  { title: "SEO & croissance", desc: "Structure technique, contenu et données structurées pour être trouvé — pas seulement vu." },
];

export default function ServicesPage() {
  return (
    <>
      <section className="hero-banner">
        <HorizonCanvas horizonRatio={0.85} baobabScale={0.7} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />
            NOS SERVICES
          </div>
          <h1>
            Chaque compétence nécessaire, <em>sous un même toit.</em>
          </h1>
          <p className="hero-sub">
            Du site vitrine à la plateforme SaaS complète — nous couvrons l'ensemble de la chaîne technique et
            créative d'un produit digital.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Développement</span>
            <h2>Sites, applications & logiciels métiers.</h2>
          </Reveal>

          {DEV_SERVICES.map((s) => (
            <Reveal className="service-row" key={s.num}>
              <div className="service-num">{s.num}</div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div className="service-tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Intelligence Artificielle</span>
            <h2>Des agents IA qui font vraiment le travail.</h2>
          </Reveal>
          <Reveal className="grid-4">
            {AI_CARDS.map((c) => (
              <div className="card" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Infrastructure & confiance</span>
            <h2>Ce qui ne se voit pas, mais qui protège tout le reste.</h2>
          </Reveal>
          <Reveal className="grid-3">
            {INFRA_CARDS.map((c) => (
              <div className="card" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Design & croissance</span>
            <h2>L'image qui donne envie de vous faire confiance.</h2>
          </Reveal>
          <Reveal className="grid-3">
            {DESIGN_CARDS.map((c) => (
              <div className="card" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <Reveal className="wrap cta-box">
          <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
            Une idée en tête ?
          </span>
          <h2>Décrivez votre projet, nous vous répondons sous 48h.</h2>
          <div className="cta-actions">
            <Link href="/contact" className="btn-primary">
              Demander un devis
            </Link>
            <Link href="/tarifs" className="btn-ghost">
              Voir les tarifs
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
