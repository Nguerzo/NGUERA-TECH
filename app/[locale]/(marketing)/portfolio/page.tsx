import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import portfolioEcommerce from "@/public/images/portfolio-ecommerce.png";
import serviceDashboard from "@/public/images/service-dashboard.png";
import serviceCybersecurite from "@/public/images/service-cybersecurite.png";
import serviceIa from "@/public/images/service-ia.png";
import serviceCloud from "@/public/images/service-cloud.png";
import serviceMobile from "@/public/images/service-mobile.png";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("portfolio.hero");
  return {
    title: `Portfolio — NGUERA SENEGALENSIS TECH — ${t("headline")}`,
    description: t("sub"),
    alternates: alternatesFor("/portfolio"),
  };
}

const IMAGES: Record<string, StaticImageData> = {
  ecommerce: portfolioEcommerce,
  "saas-dashboard": serviceDashboard,
  "security-platform": serviceCybersecurite,
  "ai-agents": serviceIa,
  "cloud-infrastructure": serviceCloud,
  "mobile-tracking": serviceMobile,
};

type PortfolioContentItem = {
  slug: string;
  badge: "demo" | "concept";
  title: string;
  desc: string;
  tags: string[];
};

export default async function PortfolioPage() {
  const t = await getTranslations("portfolio");
  const items = t.raw("items") as PortfolioContentItem[];
  const badges = t.raw("badges") as { demo: string; concept: string };

  return (
    <>
      <section className="section-v2" style={{ paddingTop: 176, paddingBottom: 64 }}>
        <div className="wrap">
          <Reveal className="section-v2-head" style={{ maxWidth: 760 }}>
            <span className="kicker-v2">{t("hero.eyebrow")}</span>
            <h1 className="services-hero-h1">{t("hero.headline")}</h1>
            <p className="section-v2-sub" style={{ maxWidth: 680 }}>
              {t("hero.sub")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="portfolio-list">
        <div className="wrap">
          {items.map((item, i) => (
            <Reveal className={`portfolio-item${i % 2 === 1 ? " reverse" : ""}${i === 0 ? " featured" : ""}`} key={item.slug}>
              <div className="portfolio-media">
                <Image
                  src={IMAGES[item.slug]}
                  alt={`${item.badge === "demo" ? badges.demo : badges.concept} — ${item.title}`}
                  sizes="(max-width: 860px) 100vw, 60vw"
                  priority={i === 0}
                />
              </div>
              <div className="portfolio-body">
                <span className={`portfolio-badge${item.badge === "concept" ? " concept" : ""}`}>
                  {item.badge === "demo" ? badges.demo : badges.concept}
                </span>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <div className="portfolio-tags">
                  {item.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
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
