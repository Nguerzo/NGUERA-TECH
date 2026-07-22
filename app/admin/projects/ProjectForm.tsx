"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createProject, type CreateProjectState } from "./actions";

const initialState: CreateProjectState = {};

const STATUS_OPTIONS = [
  { value: "DEVIS", label: "Devis" },
  { value: "EN_COURS", label: "En cours" },
  { value: "EN_REVISION", label: "En révision" },
  { value: "LIVRE", label: "Livré" },
  { value: "MAINTENANCE", label: "Maintenance" },
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary form-submit" disabled={pending} aria-busy={pending}>
      {pending ? "Création..." : "Créer le projet"}
    </button>
  );
}

export default function ProjectForm({ clients }: { clients: { id: string; fullName: string; email: string }[] }) {
  const [state, formAction] = useActionState(createProject, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <div className="field">
        <label htmlFor="clientId">Client</label>
        <select id="clientId" name="clientId" required defaultValue="">
          <option value="" disabled>
            Sélectionner un client
          </option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} ({c.email})
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="title">Titre du projet</label>
        <input id="title" name="title" type="text" required />
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <textarea id="description" name="description" required />
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="status">Statut</label>
          <select id="status" name="status" defaultValue="DEVIS">
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="budgetEstime">Budget estimé (FCFA)</label>
          <input id="budgetEstime" name="budgetEstime" type="number" min="0" step="1" />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label htmlFor="dateDebut">Date de début</label>
          <input id="dateDebut" name="dateDebut" type="date" />
        </div>
        <div className="field">
          <label htmlFor="dateLivraison">Date de livraison prévue</label>
          <input id="dateLivraison" name="dateLivraison" type="date" />
        </div>
      </div>

      {state.error && (
        <p role="alert" style={{ color: "var(--bissap)", fontSize: 13.5, marginBottom: 16 }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" style={{ color: "var(--cyan)", fontSize: 13.5, marginBottom: 16 }}>
          Projet créé.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
