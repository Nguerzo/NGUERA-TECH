"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createInvoice, type CreateInvoiceState } from "./actions";

const initialState: CreateInvoiceState = {};

const STATUS_OPTIONS = [
  { value: "BROUILLON", label: "Brouillon" },
  { value: "ENVOYEE", label: "Envoyée" },
  { value: "PAYEE", label: "Payée" },
  { value: "EN_RETARD", label: "En retard" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary form-submit" disabled={pending} aria-busy={pending}>
      {pending ? "Création..." : "Créer la facture"}
    </button>
  );
}

export default function InvoiceForm({
  projects,
}: {
  projects: { id: string; title: string; client: { fullName: string } }[];
}) {
  const [state, formAction] = useActionState(createInvoice, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <div className="field">
        <label htmlFor="projectId">Projet</label>
        <select id="projectId" name="projectId" required defaultValue="">
          <option value="" disabled>
            Sélectionner un projet
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} — {p.client.fullName}
            </option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="amount">Montant</label>
          <input id="amount" name="amount" type="number" min="0" step="1" required />
        </div>
        <div className="field">
          <label htmlFor="currency">Devise</label>
          <input id="currency" name="currency" type="text" defaultValue="XOF" required />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="dueDate">Échéance</label>
          <input id="dueDate" name="dueDate" type="date" required />
        </div>
        <div className="field">
          <label htmlFor="status">Statut</label>
          <select id="status" name="status" defaultValue="BROUILLON">
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {state.error && (
        <p role="alert" style={{ color: "var(--bissap)", fontSize: 13.5, marginBottom: 16 }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" style={{ color: "var(--cyan)", fontSize: 13.5, marginBottom: 16 }}>
          Facture créée.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
