import { describe, it, expect } from "vitest";
import { createQuoteSchema } from "./quotes";

const valid = {
  clientId: "client-1",
  currency: "GBP" as const,
  validUntil: "2026-08-01",
  notes: "Livraison en deux temps",
  items: [{ description: "Développement site vitrine", quantity: 1, unitPrice: 3500 }],
};

describe("createQuoteSchema", () => {
  it("accepts a fully valid payload", () => {
    expect(createQuoteSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts multiple line items", () => {
    const result = createQuoteSchema.safeParse({
      ...valid,
      items: [
        { description: "Design", quantity: 1, unitPrice: 1200 },
        { description: "Développement", quantity: 1, unitPrice: 2800 },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an empty item list", () => {
    expect(createQuoteSchema.safeParse({ ...valid, items: [] }).success).toBe(false);
  });

  it("rejects a negative unit price", () => {
    const result = createQuoteSchema.safeParse({
      ...valid,
      items: [{ description: "Ligne", quantity: 1, unitPrice: -10 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects a zero or negative quantity", () => {
    const result = createQuoteSchema.safeParse({
      ...valid,
      items: [{ description: "Ligne", quantity: 0, unitPrice: 10 }],
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unsupported currency", () => {
    expect(createQuoteSchema.safeParse({ ...valid, currency: "JPY" }).success).toBe(false);
  });

  it("rejects a missing client", () => {
    expect(createQuoteSchema.safeParse({ ...valid, clientId: "" }).success).toBe(false);
  });
});
