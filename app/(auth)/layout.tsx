import type { Metadata } from "next";
import "@/styles/portal.css";
import { ThemeProvider } from "@/components/portal/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Connexion — NGUERA SENEGALENSIS TECH",
  description: "Connectez-vous à votre espace client.",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      <div className="portal-root min-h-screen">{children}</div>
      <Toaster />
    </ThemeProvider>
  );
}
