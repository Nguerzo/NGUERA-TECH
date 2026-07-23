"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitLead, type SubmitLeadResult } from "@/app/actions/lead";

export type ContactFormLabels = {
  sectionContact: string;
  name: string;
  namePlaceholder: string;
  company: string;
  companyPlaceholder: string;
  email: string;
  emailPlaceholder: string;
  phone: string;
  phonePlaceholder: string;
  country: string;
  countryPlaceholder: string;
  sectionProject: string;
  service: string;
  serviceOptions: string[];
  message: string;
  messagePlaceholder: string;
  budget: string;
  budgetOptions: string[];
  timeline: string;
  timelineOptions: string[];
  sectionPreference: string;
  contactPreference: string;
  preferenceOptions: string[];
  consent: string;
  marketingConsent: string;
  submit: string;
  note: string;
  successTitle: string;
  successBody: string;
  successReset: string;
  duplicateTitle: string;
  duplicateBody: string;
  rateLimitedTitle: string;
  rateLimitedBody: string;
  serverErrorTitle: string;
  serverErrorBody: string;
  validationErrorBanner: string;
};

const COUNTRIES = [
  "United Kingdom",
  "Senegal",
  "France",
  "Other EU country",
  "United States",
  "Canada",
  "United Arab Emirates",
  "Other",
];

const INITIAL_STATE: SubmitLeadResult = { status: "idle" };

function SubmitButton({ label, consentChecked }: { label: string; consentChecked: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-electric form-submit-v2" disabled={!consentChecked || pending}>
      {pending ? "…" : label}
    </button>
  );
}

function ConfirmationCard({ title, body, resetLabel, onReset }: { title: string; body: string; resetLabel: string; onReset: () => void }) {
  return (
    <div className="contact-form-success" role="status" aria-live="polite">
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
      <h3>{title}</h3>
      <p>{body}</p>
      <button type="button" className="btn-outline" onClick={onReset}>
        {resetLabel}
      </button>
    </div>
  );
}

export default function ContactForm(props: { labels: ContactFormLabels; locale: string; currency: string }) {
  // useActionState's result lives inside ContactFormInner — the only way to
  // clear it back to the form (after a success/duplicate confirmation) is to
  // remount that component entirely, hence the key bump here.
  const [instanceKey, setInstanceKey] = useState(0);
  return <ContactFormInner key={instanceKey} {...props} onReset={() => setInstanceKey((k) => k + 1)} />;
}

function ContactFormInner({
  labels,
  locale,
  currency,
  onReset,
}: {
  labels: ContactFormLabels;
  locale: string;
  currency: string;
  onReset: () => void;
}) {
  const [state, formAction] = useActionState(submitLead, INITIAL_STATE);
  const [consentChecked, setConsentChecked] = useState(false);

  const fieldErrors = state.status === "validation_error" ? state.fieldErrors : undefined;

  if (state.status === "success") {
    return (
      <ConfirmationCard title={labels.successTitle} body={labels.successBody} resetLabel={labels.successReset} onReset={onReset} />
    );
  }

  if (state.status === "duplicate") {
    return (
      <ConfirmationCard title={labels.duplicateTitle} body={labels.duplicateBody} resetLabel={labels.successReset} onReset={onReset} />
    );
  }

  return (
    <form className="contact-form-v2" action={formAction}>
      {/* Honeypot — hidden from real visitors via CSS, invisible to screen readers. */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="currency" value={currency} />
      <input type="hidden" name="source" value="website_contact_form" />

      {state.status === "rate_limited" && (
        <div className="form-banner form-banner-error" role="alert">
          <strong>{labels.rateLimitedTitle}</strong> {labels.rateLimitedBody}
        </div>
      )}
      {state.status === "server_error" && (
        <div className="form-banner form-banner-error" role="alert">
          <strong>{labels.serverErrorTitle}</strong> {labels.serverErrorBody}
        </div>
      )}
      {state.status === "validation_error" && (
        <div className="form-banner form-banner-error" role="alert">
          {labels.validationErrorBanner}
        </div>
      )}

      <span className="contact-form-section">{labels.sectionContact}</span>
      <div className="form-row">
        <div className="field">
          <label htmlFor="fullName">{labels.name}</label>
          <input id="fullName" name="fullName" type="text" placeholder={labels.namePlaceholder} required />
          {fieldErrors?.fullName && <span className="field-error">{fieldErrors.fullName}</span>}
        </div>
        <div className="field">
          <label htmlFor="company">{labels.company}</label>
          <input id="company" name="company" type="text" placeholder={labels.companyPlaceholder} />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">{labels.email}</label>
          <input id="email" name="email" type="email" placeholder={labels.emailPlaceholder} required />
          {fieldErrors?.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>
        <div className="field">
          <label htmlFor="phone">{labels.phone}</label>
          <input id="phone" name="phone" type="tel" placeholder={labels.phonePlaceholder} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="country">{labels.country}</label>
        <select id="country" name="country" defaultValue="">
          <option value="" disabled>
            {labels.countryPlaceholder}
          </option>
          {COUNTRIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <span className="contact-form-section">{labels.sectionProject}</span>
      <div className="field">
        <label htmlFor="service">{labels.service}</label>
        <select id="service" name="service">
          {labels.serviceOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor="projectDescription">{labels.message}</label>
        <textarea id="projectDescription" name="projectDescription" placeholder={labels.messagePlaceholder} />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="budget">{labels.budget}</label>
          <select id="budget" name="budget">
            {labels.budgetOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="timeline">{labels.timeline}</label>
          <select id="timeline" name="timeline">
            {labels.timelineOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      </div>

      <span className="contact-form-section">{labels.sectionPreference}</span>
      <div className="field">
        <label htmlFor="preference">{labels.contactPreference}</label>
        <div className="contact-form-radios">
          {labels.preferenceOptions.map((o, i) => (
            <label key={o} className="contact-form-radio">
              <input type="radio" name="contactPreference" value={o} defaultChecked={i === 0} />
              {o}
            </label>
          ))}
        </div>
      </div>

      <label className="contact-form-checkbox">
        <input
          type="checkbox"
          name="gdprConsent"
          required
          checked={consentChecked}
          onChange={(e) => setConsentChecked(e.target.checked)}
        />
        <span>{labels.consent}</span>
      </label>
      <label className="contact-form-checkbox">
        <input type="checkbox" name="marketingConsent" />
        <span>{labels.marketingConsent}</span>
      </label>

      <SubmitButton label={labels.submit} consentChecked={consentChecked} />
      <p className="form-note-v2">{labels.note}</p>
    </form>
  );
}
