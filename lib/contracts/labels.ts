import type { ContractStatus } from "@prisma/client";

export const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  BROUILLON: "Brouillon",
  ENVOYE: "Envoyé",
  SIGNE: "Signé",
};

export const CONTRACT_STATUS_ORDER: ContractStatus[] = ["BROUILLON", "ENVOYE", "SIGNE"];

export const CONTRACT_STATUS_STYLE: Record<ContractStatus, string> = {
  BROUILLON: "bg-secondary text-secondary-foreground",
  ENVOYE: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  SIGNE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
};
