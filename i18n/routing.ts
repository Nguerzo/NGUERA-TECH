import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "fr"],
  defaultLocale: "en",
  // English is served at the root ("/services"), French is prefixed ("/fr/...") —
  // matches "EN-GB as primary language" from the brief.
  localePrefix: {
    mode: "as-needed",
    prefixes: { fr: "/fr" },
  },
  // English is the default for every visitor at "/" regardless of browser
  // language — the brief requires EN-GB as the primary language, not
  // Accept-Language-based negotiation. French is only ever reached via /fr
  // or the explicit language switcher.
  localeDetection: false,
  // Localized slugs: same page, a URL that reads naturally in each language.
  pathnames: {
    "/": "/",
    "/services": "/services",
    "/portfolio": "/portfolio",
    "/about": { en: "/about", fr: "/a-propos" },
    "/pricing": { en: "/pricing", fr: "/tarifs" },
    "/contact": "/contact",
    "/thank-you": { en: "/thank-you", fr: "/merci" },
  },
});
