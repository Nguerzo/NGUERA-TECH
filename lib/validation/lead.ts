import { z } from "zod";

// Server-side validation for the public contact/quote form. Every field here
// mirrors components/marketing/ContactForm.tsx — keep them in sync.
export const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short").max(120, "Full name is too long"),
  company: z.string().trim().max(160, "Company name is too long").optional().or(z.literal("")),
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email address").max(200),
  phone: z.string().trim().max(40, "Phone number is too long").optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  service: z.string().trim().max(160).optional().or(z.literal("")),
  projectDescription: z.string().trim().max(4000, "Description is too long").optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  currency: z.enum(["GBP", "FCFA", "EUR", "USD"]).optional(),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  contactPreference: z.string().trim().max(40).optional().or(z.literal("")),
  gdprConsent: z.boolean().refine((v) => v === true, { message: "You must agree to be contacted to submit this form" }),
  marketingConsent: z.boolean().default(false),
  locale: z.enum(["en", "fr"]),
  source: z.string().trim().max(120).default("website_contact_form"),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadFieldErrors = Partial<Record<keyof LeadInput, string>>;

export function flattenLeadErrors(error: z.ZodError<LeadInput>): LeadFieldErrors {
  const errors: LeadFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof LeadInput | undefined;
    if (key && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}
