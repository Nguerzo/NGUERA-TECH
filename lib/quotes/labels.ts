import type { QuoteStatus } from "@prisma/client";

export const QUOTE_STATUS_LABEL: Record<QuoteStatus, string> = {
  BROUILLON: "Brouillon",
  ENVOYE: "Envoyé",
  ACCEPTE: "Accepté",
  REFUSE: "Refusé",
  EXPIRE: "Expiré",
};

export const QUOTE_STATUS_ORDER: QuoteStatus[] = ["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "EXPIRE"];

export const QUOTE_STATUS_STYLE: Record<QuoteStatus, string> = {
  BROUILLON: "bg-secondary text-secondary-foreground",
  ENVOYE: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  ACCEPTE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  REFUSE: "bg-red-500/10 text-red-600 dark:text-red-400",
  EXPIRE: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};
