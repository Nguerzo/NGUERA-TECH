import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion — NGUERA SENEGALENSIS TECH",
  description: "Connectez-vous à votre espace client.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
