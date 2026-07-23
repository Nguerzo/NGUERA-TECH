"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { motion } from "framer-motion";
import LogoMark from "@/components/Logo";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary form-submit" disabled={pending} aria-busy={pending}>
      {pending ? "Connexion..." : "Se connecter"}
    </button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <motion.div
        className="panel"
        style={{ width: "100%", maxWidth: 420 }}
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
        <div className="logo" style={{ marginBottom: 8 }}>
          <LogoMark size={24} /> NGUERA·TECH
        </div>
        <h1 style={{ fontSize: 26, marginTop: 18, marginBottom: 6 }}>Espace client</h1>
        <p className="section-sub" style={{ marginBottom: 28 }}>
          Suivez vos projets, factures et documents en un seul endroit.
        </p>

        <form action={formAction} noValidate>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="field">
            <label htmlFor="password">Mot de passe</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {state.error && (
            <p role="alert" style={{ color: "var(--bissap)", fontSize: 13.5, marginBottom: 16 }}>
              {state.error}
            </p>
          )}

          <SubmitButton />
        </form>

        <p className="form-note" style={{ marginTop: 20 }}>
          Pas encore de compte ? Les accès sont créés par notre équipe après signature du devis.
          Contactez-nous depuis <a href="/fr/contact" style={{ color: "var(--gold)" }}>la page contact</a>.
        </p>
      </motion.div>
    </main>
  );
}
