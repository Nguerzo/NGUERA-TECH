import type { Metadata } from "next";
import "./globals.css";

const SITE_NAME = "NGUERA SENEGALENSIS TECH";
const SITE_DESCRIPTION =
  "Entreprise technologique africaine spécialisée en Intelligence Artificielle, développement web, applications, SaaS, cloud et cybersécurité.";

export const metadata: Metadata = {
  title: `${SITE_NAME} — Building the Future with Artificial Intelligence`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
