import { Resend } from "resend";
import { profile } from "@/lib/content/profile";
import { SITE_URL } from "@/lib/site";
import {
  renderContactHtml,
  renderContactText,
} from "@/lib/email/contact-template";

interface ContactPayload {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  /** Honeypot, must be empty for a legitimate submission. */
  company?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value: unknown, max: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max;
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: silently accept (so bots don't learn) but do nothing.
  if (typeof payload.company === "string" && payload.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const { name, email, message } = payload;

  if (!isNonEmptyString(name, 120)) {
    return Response.json({ error: "Please enter your name." }, { status: 400 });
  }
  if (!isNonEmptyString(email, 200) || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  }
  if (!isNonEmptyString(message, 5000)) {
    return Response.json(
      { error: "Please enter a message." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL ?? profile.email;
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  // Not configured yet (e.g. before deploy): don't 500, just tell the client.
  if (!apiKey) {
    console.warn(
      "[contact] RESEND_API_KEY not set, skipping email send. See .env.example.",
    );
    return Response.json(
      {
        error:
          "The contact form isn't fully configured yet. Please email me directly.",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);

    const emailInput = {
      name,
      email,
      message,
      siteUrl: SITE_URL,
      brandName: profile.name,
    };

    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New portfolio message from ${name}`,
      text: renderContactText(emailInput),
      html: renderContactHtml(emailInput),
    });

    if (error) {
      console.error("[contact] Resend error:", error);
      return Response.json(
        { error: "Failed to send. Please try again or email me directly." },
        { status: 502 },
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return Response.json(
      { error: "Failed to send. Please try again or email me directly." },
      { status: 500 },
    );
  }
}
