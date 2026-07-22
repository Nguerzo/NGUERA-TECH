import type { Metadata } from "next";
import Link from "next/link";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";
import Faq from "@/components/marketing/Faq";

export const metadata: Metadata = {
  title: "Tarifs — NGUERA SENEGALENSIS TECH",
  description: "Grille tarifaire indicative pour vos projets web, mobile, SaaS et IA — devis personnalisé sous 48h.",
};

const FAQ_ITEMS = [
  {
    question: "Comment est calculé le prix final d'un projet ?",
    answer:
      "Sur la base du périmètre fonctionnel réel (nombre de pages, intégrations, niveau de sécurité requis) et du délai souhaité. Nous évitons les forfaits flous : chaque ligne du devis est justifiée.",
  },
  {
    question: "Un acompte est-il demandé au démarrage ?",
    answer:
      "Oui, un acompte est généralement demandé à la signature, avec le solde échelonné selon les jalons du projet. Les modalités exactes sont précisées dans chaque devis.",
  },
  {
    question: "Proposez-vous un accompagnement après la mise en ligne ?",
    answer:
      "Oui, sous forme de forfait de maintenance mensuel (corrections, mises à jour de sécurité, petites évolutions) ou d'interventions ponctuelles selon vos besoins.",
  },
  {
    question: "Les paiements locaux (Wave, Orange Money) sont-ils inclus ?",
    answer:
      "Nous intégrons ces moyens de paiement techniquement, mais l'ouverture du compte marchand auprès de chaque opérateur reste à votre charge — c'est une exigence réglementaire, pas un choix technique.",
  },
];

export default function TarifsPage() {
  return (
    <>
      <section className="hero-banner">
        <HorizonCanvas horizonRatio={0.85} baobabScale={0.7} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />
            TARIFS
          </div>
          <h1>
            Une base claire. <em>Un devis sur mesure.</em>
          </h1>
          <p className="hero-sub">
            Chaque projet est différent — voici comment nous raisonnons nos prix, avec des ordres de grandeur pour
            vous orienter.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="pricing-note">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            <p>
              <strong>À lire avant tout :</strong> les montants ci-dessous sont des{" "}
              <strong>ordres de grandeur indicatifs</strong>, pas des prix fermes. Le tarif final dépend du
              périmètre exact, des intégrations (paiement, IA, données existantes) et des délais souhaités. Un
              devis précis est établi après un premier échange, sans engagement.
            </p>
          </Reveal>

          <Reveal className="section-head">
            <span className="kicker">Formules</span>
            <h2>Trois points de départ, ajustés à votre projet.</h2>
          </Reveal>

          <Reveal className="pricing-grid">
            <div className="price-card">
              <h3>Starter</h3>
              <p className="price-desc">Site vitrine ou landing page premium, prêt à convertir.</p>
              <div className="price-from">À partir de</div>
              <div className="price-amount">
                800 000 <span>FCFA</span>
              </div>
              <ul className="price-features">
                <li>Jusqu'à 6 pages</li>
                <li>Design sur mesure</li>
                <li>Responsive & SEO de base</li>
                <li>Formulaire de contact</li>
                <li>Hébergement configuré</li>
              </ul>
              <Link href="/contact" className="btn-ghost" style={{ textAlign: "center" }}>
                Demander un devis
              </Link>
            </div>

            <div className="price-card featured">
              <span className="price-badge">Le plus demandé</span>
              <h3>Business</h3>
              <p className="price-desc">Plateforme complète : e-commerce, SaaS ou espace client.</p>
              <div className="price-from">À partir de</div>
              <div className="price-amount">
                3 500 000 <span>FCFA</span>
              </div>
              <ul className="price-features">
                <li>Tout Starter, plus :</li>
                <li>Authentification & espace client</li>
                <li>Paiement en ligne intégré</li>
                <li>Tableau de bord & statistiques</li>
                <li>3 mois de support inclus</li>
              </ul>
              <Link href="/contact" className="btn-primary" style={{ textAlign: "center" }}>
                Demander un devis
              </Link>
            </div>

            <div className="price-card">
              <h3>Enterprise</h3>
              <p className="price-desc">Plateforme IA, ERP/CRM ou produit multi-modules sur mesure.</p>
              <div className="price-from">Sur devis</div>
              <div className="price-amount">Personnalisé</div>
              <ul className="price-features">
                <li>Architecture sur mesure</li>
                <li>Agents IA & automatisation</li>
                <li>Intégrations API avancées</li>
                <li>SLA & accompagnement dédié</li>
              </ul>
              <Link href="/contact" className="btn-ghost" style={{ textAlign: "center" }}>
                Parler à un expert
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <Reveal className="section-head">
            <span className="kicker">Questions fréquentes</span>
            <h2>Ce qu'on nous demande le plus souvent.</h2>
          </Reveal>
          <Reveal style={{ maxWidth: 760 }}>
            <Faq items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      <section className="cta-section">
        <Reveal className="wrap cta-box">
          <span className="kicker" style={{ justifyContent: "center", display: "flex" }}>
            Encore un doute sur le budget ?
          </span>
          <h2>Décrivez votre projet, on vous dit précisément ce qu'il coûte.</h2>
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
