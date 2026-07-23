import { z } from "zod";

export const quoteItemSchema = z.object({
  description: z.string().trim().min(1, "Description requise").max(300),
  quantity: z.coerce.number().positive("La quantité doit être positive"),
  unitPrice: z.coerce.number().nonnegative("Le prix doit être positif ou nul"),
});

export const quoteStatusValues = ["BROUILLON", "ENVOYE", "ACCEPTE", "REFUSE", "EXPIRE"] as const;

export const createQuoteSchema = z.object({
  clientId: z.string().min(1, "Sélectionnez un client"),
  projectId: z.string().optional(),
  currency: z.enum(["GBP", "FCFA", "EUR", "USD"]),
  validUntil: z.string().optional(),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  items: z.array(quoteItemSchema).min(1, "Ajoutez au moins une ligne"),
});

export type CreateQuoteInput = z.infer<typeof createQuoteSchema>;
