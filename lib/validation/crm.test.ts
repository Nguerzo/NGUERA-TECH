import { describe, it, expect } from "vitest";
import { manualLeadSchema, noteSchema } from "./crm";

describe("manualLeadSchema", () => {
  const valid = {
    fullName: "Jean Dupont",
    company: "Acme SARL",
    email: "jean@example.com",
    phone: "+221 77 000 00 00",
    country: "Sénégal",
    locale: "fr" as const,
    source: "salon-tech-2026",
    budget: "5 000",
    currency: "GBP" as const,
    projectDescription: "Refonte du site vitrine",
  };

  it("accepts a fully valid payload", () => {
    expect(manualLeadSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a minimal payload", () => {
    const result = manualLeadSchema.safeParse({
      fullName: "Jo",
      email: "jo@example.com",
      locale: "en",
      source: "linkedin",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing name", () => {
    expect(manualLeadSchema.safeParse({ ...valid, fullName: "" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(manualLeadSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("rejects an unsupported currency", () => {
    expect(manualLeadSchema.safeParse({ ...valid, currency: "JPY" }).success).toBe(false);
  });

  it("rejects a missing source", () => {
    expect(manualLeadSchema.safeParse({ ...valid, source: "" }).success).toBe(false);
  });
});

describe("noteSchema", () => {
  it("accepts non-empty content", () => {
    expect(noteSchema.safeParse({ content: "Appelé, rappeler jeudi." }).success).toBe(true);
  });

  it("rejects empty content", () => {
    expect(noteSchema.safeParse({ content: "" }).success).toBe(false);
  });

  it("rejects overly long content", () => {
    expect(noteSchema.safeParse({ content: "a".repeat(4001) }).success).toBe(false);
  });
});
