import { FileText, Send, CheckCircle2, AlertCircle, type LucideIcon } from "lucide-react";

export const INVOICE_STATUS: Record<string, { label: string; variant: "neutral" | "cyan" | "gold" | "danger"; icon: LucideIcon }> = {
  BROUILLON: { label: "Brouillon", variant: "neutral", icon: FileText },
  ENVOYEE: { label: "Envoyée", variant: "cyan", icon: Send },
  PAYEE: { label: "Payée", variant: "gold", icon: CheckCircle2 },
  EN_RETARD: { label: "En retard", variant: "danger", icon: AlertCircle },
};

export const PROJECT_STATUS: Record<string, { label: string; variant: "neutral" | "cyan" | "gold" | "danger" | "violet" }> = {
  DEVIS: { label: "Devis", variant: "neutral" },
  EN_COURS: { label: "En cours", variant: "cyan" },
  EN_REVISION: { label: "En révision", variant: "violet" },
  LIVRE: { label: "Livré", variant: "gold" },
  MAINTENANCE: { label: "Maintenance", variant: "danger" },
};
