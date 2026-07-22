import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";
import serviceIa from "@/public/images/service-ia.png";
import serviceMobile from "@/public/images/service-mobile.png";
import serviceCloud from "@/public/images/service-cloud.png";
import serviceCybersecurite from "@/public/images/service-cybersecurite.png";

export const metadata: Metadata = {
  title: "NGUERA SENEGALENSIS TECH — Building the Future with Artificial Intelligence",
  description:
    "Entreprise technologique africaine spécialisée en Intelligence Artificielle, développement web, applications, SaaS, cloud et cybersécurité.",
};

const EXPERTISES = [
  {
    title: "Intelligence Artificielle",
    desc: "Agents IA, chatbots métiers, automatisation intelligente et intégrations OpenAI, Anthropic, Gemini, Mistral.",
    image: serviceIa,
  },
  {
    title: "Développement Web",
    desc: "Sites vitrines, plateformes e-commerce et applications web sur mesure, rapides et sécurisées.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="4" width="18" height="14" rx="2" />
        <path d="M3 9h18M8 21h8" />
      </svg>
    ),
  },
  {
    title: "Applications Mobile",
    desc: "Applications iOS et Android natives ou cross-platform, pensées pour l'échelle et la performance.",
    image: serviceMobile,
  },
  {
    title: "Cloud & DevOps",
    desc: "Infrastructures évolutives, CI/CD, conteneurisation et supervision continue.",
    image: serviceCloud,
  },
  {
    title: "Cybersécurité",
    desc: "Authentification forte, chiffrement, protection contre les attaques et audits de sécurité.",
    image: serviceCybersecurite,
  },
  {
    title: "Logiciels SaaS & ERP",
    desc: "CRM, ERP, marketplaces et outils métiers pensés pour votre organisation, pas pour un template.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    title: "Automatisation",
    desc: "Emails, WhatsApp, factures, devis, suivi client — vos processus qui tournent sans vous.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <path d="M4 19V6a2 2 0 0 1 2-2h9l5 5v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
        <path d="M14 4v5h5" />
      </svg>
    ),
  },
  {
    title: "Branding & UX/UI",
    desc: "Identité de marque, design systems et interfaces qui donnent envie de rester.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="12" cy="12" r="9" />
        <path d="M8 15c1-1.5 2.5-2 4-2s3 .5 4 2M9 9h.01M15 9h.01" />
      </svg>
    ),
  },
];

const WHY = [
  {
    title: "Standard international, ancrage local",
    desc: "Nous livrons au niveau des studios de la Silicon Valley, avec une connaissance fine du marché sénégalais et ouest-africain.",
  },
  {
    title: "Sécurité pensée dès la conception",
    desc: "Authentification, chiffrement et contrôle d'accès ne sont jamais ajoutés après coup.",
  },
  {
    title: "Code que vous possédez réellement",
    desc: "Architecture propre, documentée, livrée avec guide de déploiement — aucune dépendance cachée envers nous.",
  },
  {
    title: "Un seul interlocuteur, toutes les compétences",
    desc: "Design, développement, IA, sécurité et croissance sous un même toit — pas de coordination entre cinq prestataires.",
  },
];

const TECH_STACK = [
  "Next.js",
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Supabase",
  "Redis",
  "Docker",
  "Vercel",
  "Cloudflare",
  "Stripe",
  "OpenAI",
  "Anthropic",
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <HorizonCanvas horizonRatio={0.62} baobabScale={1} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />
            DAKAR · SÉNÉGAL — DISPONIBLE À L'INTERNATIONAL
          </div>
          <h1>
            Nous construisons le futur, <em>racine ancrée</em>, esprit tourné vers demain.
          </h1>
          <p className="hero-sub">
            NGUERA SENEGALENSIS TECH conçoit des plateformes IA, des logiciels et des produits digitaux de
            niveau mondial pour des entreprises qui refusent la médiocrité — depuis l'Afrique, pour le monde.
          </p>
          <div className="hero-actions">
            <Link href="/contact" className="btn-primary">
              Démarrer un projet
            </Link>
            <Link href="/services" className="btn-ghost">
              Voir nos expertises
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <div className="stat-num">12+</div>
              <div className="stat-label">DOMAINES D'EXPERTISE</div>
            </div>
            <div>
              <div className="stat-num">100%</div>
              <div className="stat-label">CODE PRODUCTION-READY</div>
            </div>
            <div>
              <div className="stat-num">24/7</div>
              <div className="stat-label">SUPPORT & MONITORING</div>
            </div>
          </div>
        </div>
      </section>

      <section id="expertises">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Ce que nous faisons</span>
            <h2>Une expertise complète, sous un même toit.</h2>
            <p className="section-sub">De l'idée au produit en production — sans sous-traiter la qualité.</p>
          </Reveal>
          <Reveal className="grid-4">
            {EXPERTISES.map((e) =>
              e.image ? (
                <div className="card" key={e.title}>
                  <Image
                    src={e.image}
                    alt={`Illustration — ${e.title}`}
                    width={48}
                    height={48}
                    style={{ borderRadius: 10, marginBottom: 22, objectFit: "cover" }}
                  />
                  <h3>{e.title}</h3>
                  <p>{e.desc}</p>
                </div>
              ) : (
                <div className="card" key={e.title}>
                  <div className="card-icon">{e.icon}</div>
                  <h3>{e.title}</h3>
                  <p>{e.desc}</p>
                </div>
              )
            )}
          </Reveal>
        </div>
      </section>

      <section id="pourquoi">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Pourquoi nous choisir</span>
            <h2>Une exigence qui se voit dans le détail.</h2>
          </Reveal>
          <div className="why-grid">
            <Reveal className="why-list">
              {WHY.map((w, i) => (
                <div className="why-item" key={w.title}>
                  <div className="why-num">{String(i + 1).padStart(2, "0")}</div>
                  <div>
                    <h4>{w.title}</h4>
                    <p>{w.desc}</p>
                  </div>
                </div>
              ))}
            </Reveal>
            <Reveal className="panel">
              <p className="panel-quote">
                « On ne construit pas un site. On construit <span>l'infrastructure numérique</span> sur laquelle
                une entreprise va grandir pendant dix ans. »
              </p>
              <div className="panel-foot">
                <div className="avatar" />
                <div>Équipe fondatrice — NGUERA SENEGALENSIS TECH</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section id="stack">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Notre stack</span>
            <h2>Des technologies éprouvées, pas des effets de mode.</h2>
          </Reveal>
          <Reveal className="tech-strip">
            {TECH_STACK.map((t) => (
              <span className="tech-pill" key={t}>
                {t}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <Reveal className="wrap cta-box">
          <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
            Prêt à démarrer
          </span>
          <h2>Parlons de votre projet.</h2>
          <p className="section-sub" style={{ margin: "16px auto 0" }}>
            Devis clair sous 48h. Premier échange sans engagement.
          </p>
          <div className="cta-actions">
            <Link href="/contact" className="btn-primary">
              Demander un devis
            </Link>
            <Link href="/contact" className="btn-ghost">
              Prendre rendez-vous
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
