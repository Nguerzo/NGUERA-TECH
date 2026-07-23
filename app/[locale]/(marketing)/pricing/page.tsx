import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import Faq from "@/components/marketing/Faq";
import PricingTiers from "@/components/marketing/PricingTiers";
import BudgetCalculator from "@/components/marketing/BudgetCalculator";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("pricing.hero");
  return {
    title: `Pricing — NGUERA SENEGALENSIS TECH — ${t("headline")}`,
    description: t("sub"),
    alternates: alternatesFor("/pricing"),
  };
}

export default async function PricingPage() {
  const t = await getTranslations("pricing");
  const tiers = t.raw("tiers") as {
    starter: { name: string; desc: string; features: string[]; cta: string; from: string; custom: string };
    business: { name: string; desc: string; features: string[]; cta: string; from: string; custom: string };
    enterprise: { name: string; desc: string; features: string[]; cta: string; from: string; custom: string };
  };
  const calculatorLabels = t.raw("calculator");
  const faqItems = t.raw("faq.items") as { question: string; answer: string }[];

  return (
    <>
      <section className="section-v2" style={{ paddingTop: 176, paddingBottom: 0 }}>
        <div className="wrap">
          <Reveal className="section-v2-head" style={{ maxWidth: 760 }}>
            <span className="kicker-v2">{t("hero.eyebrow")}</span>
            <h1 className="services-hero-h1">{t("hero.headline")}</h1>
            <p className="section-v2-sub" style={{ maxWidth: 620 }}>
              {t("hero.sub")}
            </p>
          </Reveal>

          <Reveal className="pricing-note-v2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v5M12 16h.01" />
            </svg>
            <p>{t("note")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <PricingTiers
            starter={tiers.starter}
            business={tiers.business}
            enterprise={tiers.enterprise}
            featuredLabel={t("featuredLabel")}
          />
        </div>
      </section>

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("calculator.kicker")}</span>
            <h2>{t("calculator.heading")}</h2>
          </Reveal>
          <Reveal>
            <BudgetCalculator labels={calculatorLabels} />
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("faq.kicker")}</span>
            <h2>{t("faq.heading")}</h2>
          </Reveal>
          <Reveal style={{ maxWidth: 760 }}>
            <Faq items={faqItems} />
          </Reveal>
        </div>
      </section>

      <section className="cta-v2">
        <Reveal className="wrap cta-v2-inner">
          <span className="kicker-v2" style={{ justifyContent: "center", display: "flex" }}>
            {t("cta.kicker")}
          </span>
          <h2 style={{ marginBottom: 32 }}>{t("cta.heading")}</h2>
          <div className="hero-v2-actions" style={{ justifyContent: "center" }}>
            <Link href="/contact" className="btn-electric">
              {t("cta.primary")}
              <ArrowRight size={16} />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
