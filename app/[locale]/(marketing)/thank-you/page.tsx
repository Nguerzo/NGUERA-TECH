import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";

export async function generateMetadata() {
  const t = await getTranslations("thankYou");
  return {
    title: `${t("headline")} — NGUERA SENEGALENSIS TECH`,
    description: t("body"),
    robots: { index: false, follow: true },
  };
}

export default async function ThankYouPage() {
  const t = await getTranslations("thankYou");

  return (
    <section className="section-v2" style={{ paddingTop: 200, minHeight: "70vh" }}>
      <div className="wrap">
        <Reveal className="contact-form-success" style={{ maxWidth: 560, margin: "0 auto" }}>
          <svg className="contact-form-success-check" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="var(--electric)" strokeWidth="2" className="contact-form-success-circle" />
            <path
              d="M15 27l7 7 15-15"
              stroke="var(--glacier)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="contact-form-success-tick"
            />
          </svg>
          <span className="kicker-v2">{t("eyebrow")}</span>
          <h1 style={{ marginTop: 10 }}>{t("headline")}</h1>
          <p>{t("body")}</p>
          <div className="hero-v2-actions">
            <Link href="/" className="btn-electric">
              {t("backHome")}
              <ArrowRight size={16} />
            </Link>
            <Link href="/services" className="btn-outline">
              {t("exploreServices")}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
