"use client";

import { useState } from "react";

const DEFAULT_NOTE =
  "Ce formulaire est une maquette d'interface : il doit être relié à un service d'envoi (ex. Resend) ou à votre CRM avant mise en production.";
const SUBMITTED_NOTE = "Maquette uniquement : aucun email n'a été envoyé. Connectez ce formulaire à un service d'envoi pour le rendre fonctionnel.";

export default function ContactForm() {
  const [note, setNote] = useState(DEFAULT_NOTE);
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setNote(SUBMITTED_NOTE);
        setSubmitted(true);
      }}
    >
      <div className="form-row">
        <div className="field">
          <label htmlFor="fname">Nom complet</label>
          <input id="fname" name="fname" type="text" placeholder="Aminata Diallo" required />
        </div>
        <div className="field">
          <label htmlFor="company">Entreprise</label>
          <input id="company" name="company" type="text" placeholder="Nom de votre structure" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="vous@entreprise.com" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Téléphone / WhatsApp</label>
          <input id="phone" name="phone" type="tel" placeholder="+221 77 000 00 00" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="service">Type de projet</label>
        <select id="service" name="service">
          <option>Site web / Landing page</option>
          <option>Application mobile</option>
          <option>Logiciel SaaS / ERP / CRM</option>
          <option>Intelligence artificielle / Agents IA</option>
          <option>Cybersécurité / Audit</option>
          <option>Autre / plusieurs besoins</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="budget">Budget indicatif</label>
        <select id="budget" name="budget">
          <option>Moins de 1 000 000 FCFA</option>
          <option>1 000 000 – 3 500 000 FCFA</option>
          <option>3 500 000 – 10 000 000 FCFA</option>
          <option>Plus de 10 000 000 FCFA</option>
          <option>Je ne sais pas encore</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="message">Décrivez votre projet</label>
        <textarea id="message" name="message" placeholder="Contexte, objectifs, délais souhaités..." />
      </div>
      <button type="submit" className="btn-primary form-submit">
        Envoyer la demande
      </button>
      <p className="form-note" style={submitted ? { color: "var(--gold)" } : undefined}>
        {note}
      </p>
    </form>
  );
}
