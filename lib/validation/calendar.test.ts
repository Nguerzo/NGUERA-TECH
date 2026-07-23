import { describe, it, expect } from "vitest";
import { z } from "zod";

// Mirrors the inline schema in app/actions/calendar.ts — kept here so the
// validation rules are covered without importing a "use server" module
// (which requires the Next.js server runtime) into the test environment.
const eventSchema = z.object({
  title: z.string().trim().min(1, "Titre requis").max(200),
  type: z.enum(["REUNION", "DEADLINE", "LIVRAISON"]),
  startAt: z.string().min(1, "Date requise"),
  endAt: z.string().optional(),
  projectId: z.string().optional(),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

const valid = {
  title: "Point client hebdomadaire",
  type: "REUNION" as const,
  startAt: "2026-08-01T10:00",
};

describe("calendar eventSchema", () => {
  it("accepts a minimal valid event", () => {
    expect(eventSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a missing title", () => {
    expect(eventSchema.safeParse({ ...valid, title: "" }).success).toBe(false);
  });

  it("rejects an invalid event type", () => {
    expect(eventSchema.safeParse({ ...valid, type: "SOIREE" }).success).toBe(false);
  });

  it("rejects a missing start date", () => {
    expect(eventSchema.safeParse({ ...valid, startAt: "" }).success).toBe(false);
  });

  it("accepts an optional project and description", () => {
    const result = eventSchema.safeParse({ ...valid, projectId: "proj-1", description: "Suivi du sprint" });
    expect(result.success).toBe(true);
  });
});
