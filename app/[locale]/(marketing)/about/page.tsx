import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import officePhoto from "@/public/images/office.png";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata() {
  const t = await getTranslations("about.hero");
  return {
    title: `About — NGUERA SENEGALENSIS TECH — ${t("headline")}`,
    description: t("sub"),
    alternates: alternatesFor("/about"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("about");
  const points = t.raw("approach.points") as { title: string; desc: string }[];
  const areas = t.raw("expertise.areas") as { role: string; desc: string }[];

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

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap about-origin">
          <Reveal className="about-origin-media">
            <Image
              src={officePhoto}
              alt="NGUERA SENEGALENSIS TECH workspace"
              sizes="(max-width: 900px) 100vw, 46vw"
              style={{ width: "100%", height: "auto" }}
            />
          </Reveal>
          <Reveal className="about-origin-text">
            <span className="kicker-v2">{t("origin.kicker")}</span>
            <h2>{t("origin.heading")}</h2>
            <p>{t("origin.body")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("mission.kicker")}</span>
            <h2>{t("mission.heading")}</h2>
            <p className="section-v2-sub" style={{ maxWidth: 620 }}>
              {t("mission.body")}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="why-v2">
            <div className="why-v2-quote">
              <span className="kicker-v2">{t("approach.kicker")}</span>
              {t("approach.heading")}
            </div>
            <div className="why-v2-list">
              {points.map((p, i) => (
                <div className="why-v2-item" key={p.title}>
                  <span className="why-v2-item-num">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{p.title}</h4>
                    <p>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-v2">
        <div className="wrap">
          <Reveal className="section-v2-head">
            <span className="kicker-v2">{t("expertise.kicker")}</span>
            <h2>{t("expertise.heading")}</h2>
            <p className="section-v2-sub" style={{ maxWidth: 620 }}>
              {t("expertise.sub")}
            </p>
          </Reveal>
          <Reveal className="expertise-grid">
            {areas.map((area) => (
              <div className="expertise-item" key={area.role}>
                <h4>{area.role}</h4>
                <p>{area.desc}</p>
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
