import type { CalendarEventType } from "@prisma/client";

export const EVENT_TYPE_LABEL: Record<CalendarEventType, string> = {
  REUNION: "Réunion",
  DEADLINE: "Deadline",
  LIVRAISON: "Livraison",
};

export const EVENT_TYPE_STYLE: Record<CalendarEventType, string> = {
  REUNION: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  DEADLINE: "bg-red-500/15 text-red-700 dark:text-red-300",
  LIVRAISON: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
};
