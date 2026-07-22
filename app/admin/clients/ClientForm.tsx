"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { createClientAccount, type CreateClientState } from "./actions";

const initialState: CreateClientState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary form-submit" disabled={pending} aria-busy={pending}>
      {pending ? "Création..." : "Créer le client"}
    </button>
  );
}

export default function ClientForm() {
  const [state, formAction] = useActionState(createClientAccount, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state.success]);

  return (
    <form ref={formRef} action={formAction} noValidate>
      <div className="form-row">
        <div className="field">
          <label htmlFor="fullName">Nom complet</label>
          <input id="fullName" name="fullName" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="companyName">Entreprise</label>
          <input id="companyName" name="companyName" type="text" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="off" />
        </div>
        <div className="field">
          <label htmlFor="phone">Téléphone</label>
          <input id="phone" name="phone" type="tel" />
        </div>
      </div>
      <div className="field">
        <label htmlFor="password">Mot de passe initial</label>
        <input id="password" name="password" type="text" required minLength={8} autoComplete="off" />
      </div>

      {state.error && (
        <p role="alert" style={{ color: "var(--bissap)", fontSize: 13.5, marginBottom: 16 }}>
          {state.error}
        </p>
      )}
      {state.success && (
        <p role="status" style={{ color: "var(--cyan)", fontSize: 13.5, marginBottom: 16 }}>
          Client créé. Communiquez-lui son email et son mot de passe initial.
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
