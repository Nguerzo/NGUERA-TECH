import { describe, it, expect } from "vitest";
import { leadSchema, flattenLeadErrors } from "./lead";

const validPayload = {
  fullName: "Jane Smith",
  company: "Acme Ltd",
  email: "jane@example.com",
  phone: "+44 7000 000000",
  country: "United Kingdom",
  service: "Web platform / SaaS",
  projectDescription: "We need a new client portal.",
  budget: "£1,000 – £3,500",
  currency: "GBP",
  timeline: "Within 1–3 months",
  contactPreference: "Email",
  gdprConsent: true,
  marketingConsent: false,
  locale: "en",
  source: "website_contact_form",
};

describe("leadSchema", () => {
  it("accepts a fully valid payload", () => {
    const result = leadSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it("accepts a minimal payload (only required fields)", () => {
    const result = leadSchema.safeParse({
      fullName: "Jo",
      email: "jo@example.com",
      gdprConsent: true,
      marketingConsent: false,
      locale: "fr",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing full name", () => {
    const result = leadSchema.safeParse({ ...validPayload, fullName: "" });
    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const result = leadSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = flattenLeadErrors(result.error);
      expect(errors.email).toBeDefined();
    }
  });

  it("rejects when GDPR consent is false", () => {
    const result = leadSchema.safeParse({ ...validPayload, gdprConsent: false });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported currency", () => {
    const result = leadSchema.safeParse({ ...validPayload, currency: "JPY" });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported locale", () => {
    const result = leadSchema.safeParse({ ...validPayload, locale: "de" });
    expect(result.success).toBe(false);
  });

  it("rejects an overly long project description", () => {
    const result = leadSchema.safeParse({ ...validPayload, projectDescription: "a".repeat(4001) });
    expect(result.success).toBe(false);
  });

  it("flattenLeadErrors returns one message per field", () => {
    const result = leadSchema.safeParse({ ...validPayload, fullName: "", email: "bad" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = flattenLeadErrors(result.error);
      expect(Object.keys(errors)).toContain("fullName");
      expect(Object.keys(errors)).toContain("email");
    }
  });
});
