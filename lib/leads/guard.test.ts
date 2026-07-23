import { describe, it, expect } from "vitest";
import { isHoneypotTriggered, isRateLimited, isDuplicateSubmission, RATE_LIMIT, DUPLICATE_WINDOW_MINUTES } from "./guard";

describe("isHoneypotTriggered", () => {
  it("is false when the field is empty", () => {
    expect(isHoneypotTriggered("")).toBe(false);
  });
  it("is false when the field is missing entirely", () => {
    expect(isHoneypotTriggered(undefined)).toBe(false);
    expect(isHoneypotTriggered(null)).toBe(false);
  });
  it("is false for whitespace-only input", () => {
    expect(isHoneypotTriggered("   ")).toBe(false);
  });
  it("is true when a bot fills the field", () => {
    expect(isHoneypotTriggered("http://spam.example")).toBe(true);
  });
});

describe("isRateLimited", () => {
  it("allows submissions under the limit", () => {
    expect(isRateLimited(0)).toBe(false);
    expect(isRateLimited(RATE_LIMIT.maxAttempts - 1)).toBe(false);
  });
  it("blocks once the limit is reached", () => {
    expect(isRateLimited(RATE_LIMIT.maxAttempts)).toBe(true);
    expect(isRateLimited(RATE_LIMIT.maxAttempts + 5)).toBe(true);
  });
  it("respects a custom limit", () => {
    expect(isRateLimited(2, 3)).toBe(false);
    expect(isRateLimited(3, 3)).toBe(true);
  });
});

describe("isDuplicateSubmission", () => {
  const now = new Date("2026-01-01T12:00:00Z");

  it("is false when there is no prior submission", () => {
    expect(isDuplicateSubmission(null, now)).toBe(false);
  });
  it("is true for a submission inside the window", () => {
    const fiveMinAgo = new Date(now.getTime() - 5 * 60_000);
    expect(isDuplicateSubmission(fiveMinAgo, now)).toBe(true);
  });
  it("is false right at the edge of the window", () => {
    const justOutside = new Date(now.getTime() - (DUPLICATE_WINDOW_MINUTES * 60_000 + 1000));
    expect(isDuplicateSubmission(justOutside, now)).toBe(false);
  });
  it("is false for a future timestamp (clock skew safety)", () => {
    const future = new Date(now.getTime() + 60_000);
    expect(isDuplicateSubmission(future, now)).toBe(false);
  });
});
