import "server-only";
import { Resend } from "resend";
import { confirmationEmail, adminNotificationEmail, type LeadEmailData } from "./templates";

// RESEND_API_KEY is intentionally allowed to be unset in early environments —
// callers must treat a missing key as a soft failure (log + continue), never
// as a reason to fail the lead submission itself. The lead is already saved
// in the database by the time these are called.
function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export type EmailSendResult = { sent: boolean; error?: string };

export async function sendLeadConfirmationEmail(lead: LeadEmailData): Promise<EmailSendResult> {
  const client = getResendClient();
  const fromAddress = process.env.RESEND_FROM_EMAIL;

  if (!client || !fromAddress) {
    return { sent: false, error: "RESEND_API_KEY or RESEND_FROM_EMAIL is not configured" };
  }

  const { subject, html, text } = confirmationEmail(lead);

  try {
    const result = await client.emails.send({
      from: fromAddress,
      to: lead.email,
      subject,
      html,
      text,
    });
    if (result.error) return { sent: false, error: result.error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}

export async function sendAdminNotificationEmail(lead: LeadEmailData): Promise<EmailSendResult> {
  const client = getResendClient();
  const fromAddress = process.env.RESEND_FROM_EMAIL;
  const adminAddress = process.env.ADMIN_NOTIFICATION_EMAIL;

  if (!client || !fromAddress || !adminAddress) {
    return { sent: false, error: "RESEND_API_KEY, RESEND_FROM_EMAIL or ADMIN_NOTIFICATION_EMAIL is not configured" };
  }

  const { subject, html, text } = adminNotificationEmail(lead);

  try {
    const result = await client.emails.send({
      from: fromAddress,
      to: adminAddress,
      replyTo: lead.email,
      subject,
      html,
      text,
    });
    if (result.error) return { sent: false, error: result.error.message };
    return { sent: true };
  } catch (err) {
    return { sent: false, error: err instanceof Error ? err.message : "Unknown email error" };
  }
}
