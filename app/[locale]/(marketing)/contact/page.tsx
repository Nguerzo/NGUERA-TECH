import { getTranslations, getLocale } from "next-intl/server";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import Reveal from "@/components/marketing/Reveal";
import ContactForm, { type ContactFormLabels } from "@/components/marketing/ContactForm";
import { alternatesFor } from "@/lib/seo";
import { defaultCurrencyForLocale } from "@/lib/currency";

export async function generateMetadata() {
  const t = await getTranslations("contact.hero");
  return {
    title: `Contact — NGUERA SENEGALENSIS TECH — ${t("headline")}`,
    description: t("sub"),
    alternates: alternatesFor("/contact"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");
  const locale = await getLocale();
  const formLabels = t.raw("form") as ContactFormLabels;
  const info = t.raw("info") as Record<string, string>;

  const INFO_ITEMS = [
    { icon: Mail, label: info.email, value: info.emailValue, note: info.emailNote },
    { icon: Phone, label: info.phone, value: info.phoneValue, note: info.phoneNote },
    { icon: MapPin, label: info.office, value: info.officeValue, note: info.officeNote },
    { icon: Clock, label: info.availability, value: info.availabilityValue, note: info.availabilityNote },
  ];

  return (
    <>
      <section className="section-v2" style={{ paddingTop: 176, paddingBottom: 64 }}>
        <div className="wrap">
          <Reveal className="section-v2-head" style={{ maxWidth: 720 }}>
            <span className="kicker-v2">{t("hero.eyebrow")}</span>
            <h1 className="services-hero-h1">{t("hero.headline")}</h1>
            <p className="section-v2-sub">{t("hero.sub")}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-v2" style={{ paddingTop: 0 }}>
        <div className="wrap contact-grid">
          <Reveal>
            <ContactForm labels={formLabels} locale={locale} currency={defaultCurrencyForLocale(locale)} />
          </Reveal>

          <Reveal>
            <div className="contact-info-v2">
              {INFO_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div className="contact-info-v2-item" key={item.label}>
                    <Icon size={20} />
                    <div>
                      <h5>{item.label}</h5>
                      <p>
                        {item.value}
                        <br />
                        <span className="contact-info-v2-note">{item.note}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
