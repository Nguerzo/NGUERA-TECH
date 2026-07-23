import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirrors the inline schema in app/actions/settings.ts.
const companySettingsSchema = z.object({
  companyName: z.string().trim().min(1, "Nom requis").max(200),
  companyEmail: z.string().trim().email("Email invalide").optional().or(z.literal("")),
  companyPhone: z.string().trim().max(40).optional().or(z.literal("")),
  defaultCurrency: z.enum(["GBP", "FCFA", "EUR", "USD"]),
});

const valid = {
  companyName: "NGUERA SENEGALENSIS TECH",
  companyEmail: "contact@ngueratech.com",
  companyPhone: "+44 7000 000000",
  defaultCurrency: "GBP" as const,
};

describe("companySettingsSchema", () => {
  it("accepts a fully valid payload", () => {
    expect(companySettingsSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts an empty optional email", () => {
    expect(companySettingsSchema.safeParse({ ...valid, companyEmail: "" }).success).toBe(true);
  });

  it("rejects a missing company name", () => {
    expect(companySettingsSchema.safeParse({ ...valid, companyName: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(companySettingsSchema.safeParse({ ...valid, companyEmail: "not-an-email" }).success).toBe(false);
  });

  it("rejects an unsupported currency", () => {
    expect(companySettingsSchema.safeParse({ ...valid, defaultCurrency: "JPY" }).success).toBe(false);
  });
});
