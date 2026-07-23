// Pure decision functions for the lead pipeline's anti-abuse checks — kept
// separate from app/actions/lead.ts so they're testable without a database
// or network access.

export const RATE_LIMIT = {
  maxAttempts: 5,
  windowMinutes: 10,
};

export const DUPLICATE_WINDOW_MINUTES = 10;

/** A filled honeypot field means a bot filled in every input — humans never see it. */
export function isHoneypotTriggered(honeypotValue: string | undefined | null): boolean {
  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

/** True once the caller has made `maxAttempts` or more submissions within the window. */
export function isRateLimited(attemptsInWindow: number, maxAttempts: number = RATE_LIMIT.maxAttempts): boolean {
  return attemptsInWindow >= maxAttempts;
}

/** True if the same email already submitted within the duplicate window. */
export function isDuplicateSubmission(
  lastSubmissionAt: Date | null,
  now: Date,
  windowMinutes: number = DUPLICATE_WINDOW_MINUTES
): boolean {
  if (!lastSubmissionAt) return false;
  const diffMs = now.getTime() - lastSubmissionAt.getTime();
  return diffMs >= 0 && diffMs < windowMinutes * 60_000;
}
