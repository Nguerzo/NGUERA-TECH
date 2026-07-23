import type { InvoiceStatus } from "@prisma/client";

export const INVOICE_STATUS_LABEL: Record<InvoiceStatus, string> = {
  BROUILLON: "Brouillon",
  ENVOYEE: "Envoyée",
  PAYEE: "Payée",
  EN_RETARD: "En retard",
};

export const INVOICE_STATUS_ORDER: InvoiceStatus[] = ["BROUILLON", "ENVOYEE", "PAYEE", "EN_RETARD"];

export const INVOICE_STATUS_STYLE: Record<InvoiceStatus, string> = {
  BROUILLON: "bg-secondary text-secondary-foreground",
  ENVOYEE: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  PAYEE: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  EN_RETARD: "bg-red-500/10 text-red-600 dark:text-red-400",
};
