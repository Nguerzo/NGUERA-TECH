import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import HeroVisual from "@/components/marketing/HeroVisual";
import ScrollNarrative from "@/components/marketing/ScrollNarrative";
import CapabilitiesIndex from "@/components/marketing/CapabilitiesIndex";
import Reveal from "@/components/marketing/Reveal";
import { alternatesFor, SITE_URL } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("home.hero");
  return {
    title: `NGUERA SENEGALENSIS TECH — ${t("eyebrow")}`,
    description: t("subhead"),
    alternates: alternatesFor("/"),
  };
}

const STACK = [
  "Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Prisma",
  "Supabase", "Docker", "AWS", "Vercel", "OpenAI", "Anthropic",
];

export default async function HomePage() {
  const t = await getTranslations("home");

  const narrativeActs = [1, 2, 3, 4].map((n) => ({
    label: t(`narrative.step${n}Label`),
    text: t(`narrative.step${n}Text`),
  }));

  const capabilities = t.raw("capabilities.items") as { name: string; desc: string }[];

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "NGUERA SENEGALENSIS TECH",
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo-mark.png`,
    description: t("hero.subhead"),
    areaServed: ["GB", "SN", "EU", "US", "CA"],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <section className="hero-v2">
        <div className="hero-v2-inner">
          <div>
            <div className="hero-eyebrow">
              <span className="dot" />
              {t("hero.eyebrow")}
            </div>
            <h1>{t("hero.headline")}</h1>
            <p className="hero-v2-sub">{t("hero.subhead")}</p>
            <div className="hero-v2-actions">
              <Link href="/contact" className="btn-electric">
                {t("hero.ctaPrimary")}
                <ArrowRight size={16} />
              </Link>
              <Link href="/services" className="btn-outline">
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
        <div className="scroll-hint">
          <span>{t("hero.scrollHint")}</span>
          <div className="scroll-hint-line" />
        </div>
      </section>

      <ScrollNarrative acts={narrativeActs} />

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("capabilities.kicker")}</span>
            <h2>{t("capabilities.heading")}</h2>
            <p className="section-v2-sub">{t("capabilities.sub")}</p>
          </Reveal>
          <Reveal>
            <CapabilitiesIndex items={capabilities} />
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="why-v2">
            <div className="why-v2-quote">
              <span className="kicker-v2">{t("why.kicker")}</span>
              {t("why.heading")}
            </div>
            <div className="why-v2-list">
              {[1, 2, 3, 4].map((n) => (
                <div className="why-v2-item" key={n}>
                  <span className="why-v2-item-num">{String(n).padStart(2, "0")}</span>
                  <div>
                    <h4>{t(`why.point${n}Title`)}</h4>
                    <p>{t(`why.point${n}Text`)}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("stack.kicker")}</span>
            <h2>{t("stack.heading")}</h2>
          </Reveal>
          <Reveal className="stack-strip-v2">
            {STACK.map((s) => (
              <span className="stack-pill-v2" key={s}>
                {s}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="cta-v2">
        <Reveal className="wrap cta-v2-inner">
          <span className="kicker-v2" style={{ justifyContent: "center", display: "flex" }}>
            {t("cta.kicker")}
          </span>
          <h2 style={{ marginBottom: 16 }}>{t("cta.heading")}</h2>
          <p className="section-v2-sub" style={{ margin: "0 auto 36px" }}>
            {t("cta.sub")}
          </p>
          <div className="hero-v2-actions" style={{ justifyContent: "center" }}>
            <Link href="/contact" className="btn-electric">
              {t("cta.primary")}
              <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn-outline">
              {t("cta.secondary")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
