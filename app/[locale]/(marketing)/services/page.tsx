import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import ServicesExplorer, { type ServiceItem } from "@/components/marketing/ServicesExplorer";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("services.hero");
  return {
    title: `Services — NGUERA SENEGALENSIS TECH — ${t("headline")}`,
    description: t("sub"),
    alternates: alternatesFor("/services"),
  };
}

export default async function ServicesPage() {
  const t = await getTranslations("services");
  const items = t.raw("items") as ServiceItem[];
  const labels = t.raw("labels") as { benefits: string; problems: string; technologies: string; example: string; cta: string };
  const steps = t.raw("process.steps") as { title: string; desc: string }[];

  return (
    <>
      <section className="section-v2" style={{ paddingTop: 176 }}>
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("hero.eyebrow")}</span>
            <h1 className="services-hero-h1">{t("hero.headline")}</h1>
            <p className="section-v2-sub">{t("hero.sub")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <ServicesExplorer items={items} labels={labels} detailHint={t("detailHint")} />
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("process.kicker")}</span>
            <h2>{t("process.heading")}</h2>
          </Reveal>
          <Reveal className="process-timeline">
            {steps.map((s, i) => (
              <div className="process-step" key={s.title}>
                <span className="process-step-num">{String(i + 1).padStart(2, "0")}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
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
            <Link href="/pricing" className="btn-outline">
              {t("cta.secondary")}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
