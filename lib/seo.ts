// Falls back to the Vercel-assigned domain until NEXT_PUBLIC_SITE_URL is set for a custom domain.
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nguera-tech-app.vercel.app";

// Mirrors i18n/routing.ts pathnames — kept separate because this runs in contexts
// (sitemap.ts, metadata) where pulling in next-intl's request-scoped APIs isn't needed.
const LOCALIZED_PATHS: Record<string, { en: string; fr: string }> = {
  "/": { en: "/", fr: "/fr" },
  "/services": { en: "/services", fr: "/fr/services" },
  "/portfolio": { en: "/portfolio", fr: "/fr/portfolio" },
  "/about": { en: "/about", fr: "/fr/a-propos" },
  "/pricing": { en: "/pricing", fr: "/fr/tarifs" },
  "/contact": { en: "/contact", fr: "/fr/contact" },
};

export function alternatesFor(routeKey: keyof typeof LOCALIZED_PATHS) {
  const paths = LOCALIZED_PATHS[routeKey];
  return {
    canonical: `${SITE_URL}${paths.en}`,
    languages: {
      "en-GB": `${SITE_URL}${paths.en}`,
      fr: `${SITE_URL}${paths.fr}`,
      "x-default": `${SITE_URL}${paths.en}`,
    },
  };
}

export const ROUTE_KEYS = Object.keys(LOCALIZED_PATHS) as (keyof typeof LOCALIZED_PATHS)[];
export { LOCALIZED_PATHS };
