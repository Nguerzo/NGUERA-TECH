import type { Metadata } from "next";
import HorizonCanvas from "@/components/marketing/HorizonCanvas";
import Reveal from "@/components/marketing/Reveal";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Devis — NGUERA SENEGALENSIS TECH",
  description: "Demandez un devis ou prenez rendez-vous avec NGUERA SENEGALENSIS TECH.",
};

export default function ContactPage() {
  return (
    <>
      <section className="hero-banner">
        <HorizonCanvas horizonRatio={0.85} baobabScale={0.7} />
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="dot" />
            CONTACT
          </div>
          <h1>
            Parlons de <em>votre projet.</em>
          </h1>
          <p className="hero-sub">
            Remplissez le formulaire ci-dessous ou écrivez-nous directement — réponse sous 48h ouvrées.
          </p>
        </div>
      </section>

      <section className="tight">
        <div className="wrap">
          <div className="contact-grid">
            <Reveal>
              <ContactForm />
            </Reveal>

            <Reveal>
              <div className="contact-info">
                <div className="contact-info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="m4 7 8 6 8-6" />
                  </svg>
                  <div>
                    <h5>Email</h5>
                    <p>
                      contact@ngueratech.com
                      <br />
                      <span style={{ fontSize: 11.5, color: "var(--ivory-faint)" }}>
                        (adresse à remplacer par la vôtre)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7.9 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" />
                  </svg>
                  <div>
                    <h5>Téléphone / WhatsApp</h5>
                    <p>
                      +221 XX XXX XX XX
                      <br />
                      <span style={{ fontSize: 11.5, color: "var(--ivory-faint)" }}>
                        (numéro à remplacer par le vôtre)
                      </span>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 22s8-7.5 8-13a8 8 0 1 0-16 0c0 5.5 8 13 8 13Z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                  <div>
                    <h5>Bureau</h5>
                    <p>
                      Dakar, Sénégal
                      <br />
                      <span style={{ fontSize: 11.5, color: "var(--ivory-faint)" }}>(adresse précise à ajouter)</span>
                    </p>
                  </div>
                </div>
                <div className="contact-info-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 3" />
                  </svg>
                  <div>
                    <h5>Disponibilité</h5>
                    <p>
                      Lundi – Vendredi, 9h – 18h GMT
                      <br />
                      Réponse aux demandes sous 48h
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
