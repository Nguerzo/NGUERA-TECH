export type CurrencyCode = "GBP" | "FCFA" | "EUR" | "USD";

export const CURRENCIES: { code: CurrencyCode; symbol: string; label: string }[] = [
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "FCFA", symbol: "FCFA", label: "Franc CFA" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
];

export function defaultCurrencyForLocale(locale: string): CurrencyCode {
  return locale === "fr" ? "FCFA" : "GBP";
}

// Indicative starting prices, set independently per currency (no live FX conversion).
// "Enterprise" has no fixed figure — scope-dependent, quoted after a first conversation.
export type PriceTierKey = "starter" | "business";

export const PRICE_TIERS: Record<PriceTierKey, Record<CurrencyCode, number>> = {
  starter: { GBP: 1200, EUR: 1400, USD: 1500, FCFA: 800000 },
  business: { GBP: 5500, EUR: 6400, USD: 7000, FCFA: 3500000 },
};

// No live FX conversion (would need a paid, reliable API — see architecture notes).
// Each currency's amount is set independently by the business, not derived from GBP.
export function formatAmount(value: number, currency: CurrencyCode): string {
  if (currency === "FCFA") {
    return `${value.toLocaleString("fr-FR")} FCFA`;
  }
  const localeMap: Record<Exclude<CurrencyCode, "FCFA">, string> = {
    GBP: "en-GB",
    EUR: "fr-FR",
    USD: "en-US",
  };
  return new Intl.NumberFormat(localeMap[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}
