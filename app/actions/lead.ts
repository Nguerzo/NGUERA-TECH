"use server";

import { db } from "@/lib/db";
import { leadSchema, flattenLeadErrors, type LeadFieldErrors } from "@/lib/validation/lead";
import {
  isHoneypotTriggered,
  isRateLimited,
  isDuplicateSubmission,
  RATE_LIMIT,
} from "@/lib/leads/guard";
import { getRequestIp, hashIp } from "@/lib/leads/ip";
import { sendLeadConfirmationEmail, sendAdminNotificationEmail } from "@/lib/email/resend";

export type SubmitLeadResult =
  | { status: "idle" }
  | { status: "success" }
  | { status: "duplicate" }
  | { status: "rate_limited" }
  | { status: "validation_error"; fieldErrors: LeadFieldErrors }
  | { status: "server_error" };

async function logAttempt(ipHash: string, email: string | null, outcome: string, detail?: string) {
  try {
    await db.contactAttempt.create({ data: { ipHash, email, outcome, detail } });
  } catch (err) {
    // The audit log is best-effort — never let a logging failure block or crash the submission.
    console.error("[lead] failed to log contact attempt:", err);
  }
}

export async function submitLead(
  _prevState: SubmitLeadResult,
  formData: FormData
): Promise<SubmitLeadResult> {
  const ip = await getRequestIp();
  const ipHash = hashIp(ip);

  // Bots fill in every field, including the one real users never see.
  if (isHoneypotTriggered(formData.get("website") as string | null)) {
    await logAttempt(ipHash, null, "spam");
    return { status: "success" }; // never reveal the trap
  }

  const windowStart = new Date(Date.now() - RATE_LIMIT.windowMinutes * 60_000);
  let attemptsInWindow: number;
  try {
    attemptsInWindow = await db.contactAttempt.count({ where: { ipHash, createdAt: { gte: windowStart } } });
  } catch (err) {
    console.error("[lead] rate limit check failed:", err);
    return { status: "server_error" };
  }
  if (isRateLimited(attemptsInWindow)) {
    await logAttempt(ipHash, null, "rate_limited");
    return { status: "rate_limited" };
  }

  const rawEmail = String(formData.get("email") ?? "");
  const raw = {
    fullName: String(formData.get("fullName") ?? ""),
    company: String(formData.get("company") ?? ""),
    email: rawEmail,
    phone: String(formData.get("phone") ?? ""),
    country: String(formData.get("country") ?? ""),
    service: String(formData.get("service") ?? ""),
    projectDescription: String(formData.get("projectDescription") ?? ""),
    budget: String(formData.get("budget") ?? ""),
    currency: String(formData.get("currency") ?? "") || undefined,
    timeline: String(formData.get("timeline") ?? ""),
    contactPreference: String(formData.get("contactPreference") ?? ""),
    gdprConsent: formData.get("gdprConsent") === "on",
    marketingConsent: formData.get("marketingConsent") === "on",
    locale: String(formData.get("locale") ?? "en"),
    source: String(formData.get("source") ?? "website_contact_form"),
  };

  const parsed = leadSchema.safeParse(raw);
  if (!parsed.success) {
    await logAttempt(ipHash, rawEmail || null, "validation_error");
    return { status: "validation_error", fieldErrors: flattenLeadErrors(parsed.error) };
  }
  const data = parsed.data;

  try {
    const lastLead = await db.lead.findFirst({
      where: { email: data.email },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    });
    if (isDuplicateSubmission(lastLead?.createdAt ?? null, new Date())) {
      await logAttempt(ipHash, data.email, "duplicate");
      return { status: "duplicate" };
    }
  } catch (err) {
    // If we can't check for a duplicate, proceed rather than block a real lead.
    console.error("[lead] duplicate check failed:", err);
  }

  let leadId: string;
  try {
    const lead = await db.lead.create({
      data: {
        fullName: data.fullName,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        country: data.country || null,
        service: data.service || null,
        projectDescription: data.projectDescription || null,
        budget: data.budget || null,
        currency: data.currency ?? null,
        timeline: data.timeline || null,
        contactPreference: data.contactPreference || null,
        gdprConsent: data.gdprConsent,
        marketingConsent: data.marketingConsent,
        locale: data.locale,
        source: data.source,
      },
    });
    leadId = lead.id;
  } catch (err) {
    console.error("[lead] failed to save lead to Supabase:", err);
    await logAttempt(ipHash, data.email, "server_error", err instanceof Error ? err.message : undefined);
    return { status: "server_error" };
  }

  await logAttempt(ipHash, data.email, "success");

  // The lead is safely stored — emails are best-effort from here on and must
  // never turn an already-successful submission into an error for the user.
  const emailData = {
    fullName: data.fullName,
    email: data.email,
    company: data.company,
    phone: data.phone,
    country: data.country,
    service: data.service,
    projectDescription: data.projectDescription,
    budget: data.budget,
    currency: data.currency,
    timeline: data.timeline,
    contactPreference: data.contactPreference,
    marketingConsent: data.marketingConsent,
    locale: data.locale,
    source: data.source,
  };

  const [confirmationResult, adminResult] = await Promise.all([
    sendLeadConfirmationEmail(emailData),
    sendAdminNotificationEmail(emailData),
  ]);

  if (!confirmationResult.sent) {
    console.error("[lead] confirmation email failed:", confirmationResult.error);
    await logAttempt(ipHash, data.email, "email_error", `confirmation: ${confirmationResult.error}`);
  }
  if (!adminResult.sent) {
    console.error("[lead] admin notification email failed:", adminResult.error);
    await logAttempt(ipHash, data.email, "email_error", `admin: ${adminResult.error}`);
  }

  if (confirmationResult.sent || adminResult.sent) {
    try {
      await db.lead.update({
        where: { id: leadId },
        data: {
          ...(confirmationResult.sent ? { confirmationEmailSentAt: new Date() } : {}),
          ...(adminResult.sent ? { adminNotifiedAt: new Date() } : {}),
        },
      });
    } catch (err) {
      console.error("[lead] failed to record email delivery status:", err);
    }
  }

  return { status: "success" };
}
