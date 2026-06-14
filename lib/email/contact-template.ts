/**
 * Branded HTML email for contact-form submissions. Built table-first with fully
 * inlined styles and hardcoded hex (no CSS vars, flexbox, or external sheets):
 * email clients - Gmail especially - strip all of those. Colors mirror the site
 * brand tokens in app/globals.css (signature red #e30613 on near-black ink).
 *
 * Every user-supplied value is HTML-escaped before interpolation, so a message
 * body can never inject markup into the email we send ourselves.
 */

const BRAND = {
  ink: "#0b0b0c", // --color-ink-950, page background
  surface: "#131214", // --color-ink-900, raised card
  hairline: "#2a2a2d", // approximates the translucent --hairline on dark
  foreground: "#fafaf9", // --color-neutral-50
  muted: "#a8a29e", // --color-neutral-400
  subtle: "#78716c", // --color-neutral-500
  accent: "#e30613", // --color-red-600, the signature accent
} as const;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape, then turn newlines into <br> so multi-paragraph messages survive. */
function escapeMultiline(value: string): string {
  return escapeHtml(value).replace(/\r?\n/g, "<br />");
}

export interface ContactEmailInput {
  name: string;
  email: string;
  message: string;
  /** Absolute site URL for the footer link. */
  siteUrl: string;
  /** Display name for the footer signature, e.g. "Selwyn Uy". */
  brandName: string;
}

/** Plain-text fallback for clients that do not render HTML. */
export function renderContactText(input: ContactEmailInput): string {
  return [
    `New message from your portfolio contact form`,
    ``,
    `From: ${input.name} <${input.email}>`,
    ``,
    input.message,
    ``,
    `--`,
    `Sent from ${input.siteUrl}`,
  ].join("\n");
}

/** Full branded HTML email. Returns a complete document string. */
export function renderContactHtml(input: ContactEmailInput): string {
  const name = escapeHtml(input.name);
  const email = escapeHtml(input.email);
  const message = escapeMultiline(input.message);
  const siteUrl = escapeHtml(input.siteUrl);
  const siteLabel = escapeHtml(input.siteUrl.replace(/^https?:\/\//, ""));
  const brandName = escapeHtml(input.brandName);
  const mailtoReply = `mailto:${email}?subject=${encodeURIComponent(
    `Re: your message via ${input.siteUrl.replace(/^https?:\/\//, "")}`,
  )}`;

  // Preheader: hidden snippet shown in the inbox list preview.
  const preheader = `New portfolio message from ${name}`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="color-scheme" content="dark light" />
<title>New portfolio message</title>
</head>
<body style="margin:0; padding:0; background-color:${BRAND.ink}; -webkit-font-smoothing:antialiased;">
<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; font-size:1px; line-height:1px;">${preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.ink};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%;">

        <!-- Brand bar -->
        <tr>
          <td style="padding:0 0 20px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="background-color:${BRAND.accent}; width:8px; height:22px; border-radius:2px; font-size:0; line-height:0;">&nbsp;</td>
                <td style="padding-left:12px; font-family:'Helvetica Neue',Arial,sans-serif; font-size:13px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${BRAND.foreground};">${brandName}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Card -->
        <tr>
          <td style="background-color:${BRAND.surface}; border:1px solid ${BRAND.hairline}; border-radius:14px; padding:32px;">

            <p style="margin:0 0 4px 0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; text-transform:uppercase; color:${BRAND.accent};">New message</p>
            <h1 style="margin:0 0 24px 0; font-family:'Helvetica Neue',Arial,sans-serif; font-size:22px; line-height:1.3; font-weight:700; color:${BRAND.foreground};">Someone reached out via your portfolio</h1>

            <!-- From -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 20px 0;">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${BRAND.subtle}; padding:0 0 4px 0;">From</td>
              </tr>
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:16px; font-weight:600; color:${BRAND.foreground}; padding:0 0 2px 0;">${name}</td>
              </tr>
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:14px;"><a href="mailto:${email}" style="color:${BRAND.accent}; text-decoration:none;">${email}</a></td>
              </tr>
            </table>

            <!-- Divider -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr><td style="border-top:1px solid ${BRAND.hairline}; font-size:0; line-height:0; height:1px;">&nbsp;</td></tr>
            </table>

            <!-- Message -->
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:20px 0 0 0;">
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:11px; font-weight:700; letter-spacing:1px; text-transform:uppercase; color:${BRAND.subtle}; padding:0 0 10px 0;">Message</td>
              </tr>
              <tr>
                <td style="font-family:'Helvetica Neue',Arial,sans-serif; font-size:15px; line-height:1.7; color:${BRAND.foreground};">${message}</td>
              </tr>
            </table>

            <!-- Reply CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 0 0;">
              <tr>
                <td style="background-color:${BRAND.accent}; border-radius:8px;">
                  <a href="${mailtoReply}" style="display:inline-block; padding:12px 24px; font-family:'Helvetica Neue',Arial,sans-serif; font-size:14px; font-weight:700; letter-spacing:0.3px; color:#ffffff; text-decoration:none;">Reply to ${name}</a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 8px 0 8px; font-family:'Helvetica Neue',Arial,sans-serif; font-size:12px; line-height:1.6; color:${BRAND.subtle};">
            Sent from your contact form at <a href="${siteUrl}" style="color:${BRAND.muted}; text-decoration:none;">${siteLabel}</a>. Reply directly to this email to respond.
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}
