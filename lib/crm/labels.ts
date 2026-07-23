import type { LeadStatus } from "@prisma/client";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  NOUVEAU: "Nouveau",
  CONTACTE: "Contacté",
  QUALIFIE: "Qualifié",
  PROPOSITION_ENVOYEE: "Proposition envoyée",
  NEGOCIATION: "Négociation",
  GAGNE: "Gagné",
  PERDU: "Perdu",
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "NOUVEAU",
  "CONTACTE",
  "QUALIFIE",
  "PROPOSITION_ENVOYEE",
  "NEGOCIATION",
  "GAGNE",
  "PERDU",
];

// Tailwind classes per status — a calm progression (neutral → blue → violet),
// with the two terminal states (won/lost) reading clearly as positive/negative.
export const LEAD_STATUS_STYLE: Record<LeadStatus, string> = {
  NOUVEAU: "bg-secondary text-secondary-foreground",
  CONTACTE: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  QUALIFIE: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  PROPOSITION_ENVOYEE: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  NEGOCIATION: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  GAGNE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  PERDU: "bg-red-500/10 text-red-600 dark:text-red-400",
};

export const LEAD_SOURCE_LABEL: Record<string, string> = {
  website_contact_form: "Formulaire du site",
  manuel: "Ajout manuel",
};

export function leadSourceLabel(source: string) {
  return LEAD_SOURCE_LABEL[source] ?? source;
}
