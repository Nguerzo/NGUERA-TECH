// Plain, inline-styled HTML (email clients don't reliably support external
// CSS) + a text fallback for every message. Confirmation follows the
// prospect's locale; the admin notification is French, matching the rest of
// the back-office (see README — the admin tooling is intentionally
// single-language for now).

const BRAND = {
  name: "NGUERA SENEGALENSIS TECH",
  accent: "#3B6BFF",
  ink: "#0B0F17",
  dim: "#5B6472",
};

function wrapHtml(bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F4F5F7;font-family:Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F4F5F7;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E6E8EC;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid #E6E8EC;">
                <span style="font-size:13px;font-weight:700;letter-spacing:0.04em;color:${BRAND.ink};">${BRAND.name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;background:#FAFAFB;border-top:1px solid #E6E8EC;">
                <span style="font-size:11px;color:${BRAND.dim};">${BRAND.name} — Serving clients in the United Kingdom and internationally.</span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type LeadEmailData = {
  fullName: string;
  email: string;
  company?: string | null;
  phone?: string | null;
  country?: string | null;
  service?: string | null;
  projectDescription?: string | null;
  budget?: string | null;
  currency?: string | null;
  timeline?: string | null;
  contactPreference?: string | null;
  marketingConsent: boolean;
  locale: "en" | "fr";
  source: string;
};

export function confirmationEmail(lead: LeadEmailData): { subject: string; html: string; text: string } {
  const isEn = lead.locale === "en";

  const subject = isEn
    ? "We've received your enquiry — NGUERA SENEGALENSIS TECH"
    : "Nous avons bien reçu votre demande — NGUERA SENEGALENSIS TECH";

  const greeting = isEn ? `Hello ${lead.fullName},` : `Bonjour ${lead.fullName},`;
  const body1 = isEn
    ? "Thank you for reaching out. This confirms we've received your request and it's now with our team."
    : "Merci de nous avoir contactés. Ceci confirme que votre demande a bien été reçue et transmise à notre équipe.";
  const body2 = isEn
    ? "Clear proposal within 48 working hours. No obligation on this first conversation."
    : "Proposition claire sous 48 heures ouvrées. Aucun engagement à ce stade.";
  const summaryLabel = isEn ? "What you sent us" : "Ce que vous nous avez envoyé";
  const serviceLabel = isEn ? "Service" : "Service recherché";
  const signoff = isEn
    ? "Talk soon,<br/>The NGUERA SENEGALENSIS TECH team"
    : "À très vite,<br/>L'équipe NGUERA SENEGALENSIS TECH";

  const html = wrapHtml(`
    <p style="margin:0 0 16px;font-size:15px;color:${BRAND.ink};">${greeting}</p>
    <p style="margin:0 0 16px;font-size:14px;line-height:1.6;color:${BRAND.ink};">${body1}</p>
    <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:${BRAND.ink};">${body2}</p>
    <table role="presentation" width="100%" style="background:#FAFAFB;border:1px solid #E6E8EC;border-radius:8px;margin-bottom:24px;">
      <tr><td style="padding:16px 20px;">
        <span style="display:block;font-size:11px;font-weight:700;letter-spacing:0.04em;color:${BRAND.dim};text-transform:uppercase;margin-bottom:10px;">${summaryLabel}</span>
        ${lead.service ? `<p style="margin:0 0 4px;font-size:13px;color:${BRAND.ink};"><strong>${serviceLabel}:</strong> ${escapeHtml(lead.service)}</p>` : ""}
        ${lead.projectDescription ? `<p style="margin:0;font-size:13px;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(lead.projectDescription)}</p>` : ""}
      </td></tr>
    </table>
    <p style="margin:0;font-size:14px;line-height:1.6;color:${BRAND.ink};">${signoff}</p>
  `);

  const text = `${greeting}\n\n${stripHtml(body1)}\n${stripHtml(body2)}\n\n${stripHtml(signoff)}`;

  return { subject, html, text };
}

export function adminNotificationEmail(lead: LeadEmailData): { subject: string; html: string; text: string } {
  const subject = `Nouveau prospect — ${lead.fullName}${lead.company ? ` (${lead.company})` : ""}`;

  const rows: [string, string | null | undefined][] = [
    ["Nom", lead.fullName],
    ["Entreprise", lead.company],
    ["Email", lead.email],
    ["Téléphone", lead.phone],
    ["Pays", lead.country],
    ["Service recherché", lead.service],
    ["Budget indicatif", lead.budget ? `${lead.budget}${lead.currency ? ` (${lead.currency})` : ""}` : null],
    ["Délai souhaité", lead.timeline],
    ["Mode de contact préféré", lead.contactPreference],
    ["Langue", lead.locale === "en" ? "Anglais" : "Français"],
    ["Consentement marketing", lead.marketingConsent ? "Oui" : "Non"],
    ["Source", lead.source],
  ];

  const rowsHtml = rows
    .filter(([, v]) => v)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 0;font-size:13px;color:${BRAND.dim};width:180px;">${label}</td><td style="padding:6px 0;font-size:13px;color:${BRAND.ink};">${escapeHtml(String(value))}</td></tr>`
    )
    .join("");

  const html = wrapHtml(`
    <p style="margin:0 0 20px;font-size:15px;color:${BRAND.ink};font-weight:600;">Nouvelle demande reçue via le site.</p>
    <table role="presentation" width="100%" style="margin-bottom:20px;">${rowsHtml}</table>
    ${
      lead.projectDescription
        ? `<div style="background:#FAFAFB;border:1px solid #E6E8EC;border-radius:8px;padding:16px 20px;">
             <span style="display:block;font-size:11px;font-weight:700;letter-spacing:0.04em;color:${BRAND.dim};text-transform:uppercase;margin-bottom:8px;">Description du projet</span>
             <p style="margin:0;font-size:13px;color:${BRAND.ink};white-space:pre-wrap;">${escapeHtml(lead.projectDescription)}</p>
           </div>`
        : ""
    }
  `);

  const text = rows
    .filter(([, v]) => v)
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n");

  return { subject, html, text };
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtml(input: string): string {
  return input.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "");
}
