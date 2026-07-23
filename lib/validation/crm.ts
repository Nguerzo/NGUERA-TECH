import { z } from "zod";

export const leadStatusValues = [
  "NOUVEAU",
  "CONTACTE",
  "QUALIFIE",
  "PROPOSITION_ENVOYEE",
  "NEGOCIATION",
  "GAGNE",
  "PERDU",
] as const;

export const manualLeadSchema = z.object({
  fullName: z.string().trim().min(2, "Le nom est trop court").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().min(1, "L'email est requis").email("Adresse email invalide").max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  locale: z.enum(["en", "fr"]),
  source: z.string().trim().min(1).max(120),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  currency: z.enum(["GBP", "FCFA", "EUR", "USD"]).optional(),
  projectDescription: z.string().trim().max(4000).optional().or(z.literal("")),
});

export type ManualLeadInput = z.infer<typeof manualLeadSchema>;

export const noteSchema = z.object({
  content: z.string().trim().min(1, "La note ne peut pas être vide").max(4000),
});
