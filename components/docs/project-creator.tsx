"use client";

import { useState } from "react";
import {
  type Answers,
  type CenterOfGravity,
  fitVerdict,
  relevantSlugs,
} from "@/lib/docs/fit-check";

/**
 * Interactive project creator. Asks a few questions, runs Selwyn's Next.js
 * fit-check (the 6-step checklist from the fit-check page), and assembles a
 * tailored setup prompt from just the relevant playbook sections. The verdict +
 * slug-selection logic lives in lib/docs/fit-check.ts (unit tested). The
 * knowledge (slug -> markdown) is built server-side and passed in, so the
 * wizard works entirely client-side over real content, no backend.
 */

type Knowledge = Record<string, { title: string; body: string; section: string }>;

const COG_OPTIONS: {
  value: CenterOfGravity;
  label: string;
  hint: string;
}[] = [
  { value: "web", label: "A web app", hint: "Pages, a dashboard, an API, all in one" },
  { value: "sockets", label: "Heavy real-time", hint: "Thousands of live sockets: chat, multiplayer, trading" },
  { value: "mobile", label: "A native mobile app", hint: "On a phone, with device features and an app store" },
  { value: "compute", label: "Heavy compute / ML", hint: "Multi-minute jobs, batch, training, transcode" },
  { value: "static", label: "A static content site", hint: "Prose, a blog, no login, no per-request logic" },
  { value: "tiny", label: "One small endpoint", hint: "A webhook, a cron task, a tiny API, no UI" },
];

const NEEDS_OPTIONS: { value: string; label: string; slugs: string[] }[] = [
  { value: "database", label: "A database", slugs: ["supabase-setup", "database-scalability"] },
  { value: "auth", label: "Authentication", slugs: ["supabase-setup", "security-by-design"] },
  { value: "payments", label: "Payments", slugs: ["security-by-design"] },
  { value: "email", label: "Transactional email", slugs: ["email-with-resend", "email-templates"] },
  { value: "seo", label: "SEO / marketing", slugs: ["seo"] },
  { value: "realtimeLight", label: "A little real-time", slugs: [] },
];

export function ProjectCreator({
  knowledge,
  siteUrl,
  authorName,
}: {
  knowledge: Knowledge;
  siteUrl: string;
  authorName: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    building: "",
    centerOfGravity: "web",
    needs: ["database", "auth"],
    scale: "growing",
  });
  const [copied, setCopied] = useState(false);

  const verdict = fitVerdict(answers);

  function toggleNeed(v: string) {
    setAnswers((a) => ({
      ...a,
      needs: a.needs.includes(v) ? a.needs.filter((x) => x !== v) : [...a.needs, v],
    }));
  }

  function buildPrompt(): string {
    const lines: string[] = [
      `You are helping set up a project using ${authorName}'s Next.js methodology.`,
      "",
      `What I am building: ${answers.building || "(unspecified)"}`,
      `Type: ${COG_OPTIONS.find((o) => o.value === answers.centerOfGravity)?.label}`,
      `Needs: ${answers.needs.map((n) => NEEDS_OPTIONS.find((o) => o.value === n)?.label).filter(Boolean).join(", ") || "none specified"}`,
      `Scale: ${answers.scale}`,
      "",
      "FIT VERDICT: " + verdict.headline,
      verdict.body,
      verdict.reach ? verdict.reach : "",
      "",
    ];

    if (verdict.tone === "wrong") {
      lines.push(
        "Because Next.js is not the right center here, do NOT scaffold a full Next.js app for the core. Use the tool named above for the heavy part, and only use Next.js for the web surface if one is needed. Ask me before scaffolding.",
      );
      return lines.join("\n");
    }

    lines.push(
      "Apply the following sections of the methodology to scaffold my project. Treat (draft) sections as strong defaults.",
      "",
      "====================  SETUP  ====================",
      "",
    );
    for (const slug of relevantSlugs(answers)) {
      const k = knowledge[slug];
      if (!k) continue;
      lines.push(`## ${k.title}`, "", k.body, "", "----------------------------------------", "");
    }
    lines.push(
      "====================  END  ====================",
      "",
      `When you generate a README, add one line: "Bootstrapped with ${authorName}'s Next.js Handbook (${siteUrl})".`,
    );
    return lines.join("\n");
  }

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(buildPrompt());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* no-op */
    }
  }

  const steps = ["What", "Type", "Needs", "Scale", "Plan"];

  return (
    <div className="rounded-2xl bg-surface-raised p-6 ring-1 ring-hairline sm:p-8">
      {/* Progress */}
      <ol className="mb-8 flex flex-wrap gap-2 font-mono text-[10px] uppercase tracking-wider">
        {steps.map((s, i) => (
          <li
            key={s}
            className={`rounded-full px-2.5 py-1 ring-1 ${
              i === step
                ? "bg-accent text-accent-foreground ring-accent"
                : i < step
                  ? "text-accent ring-accent/30"
                  : "text-subtle ring-hairline"
            }`}
          >
            {i + 1}. {s}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <Field label="What are you building?" hint="One line is enough. This frames the prompt.">
          <input
            autoFocus
            value={answers.building}
            onChange={(e) => setAnswers((a) => ({ ...a, building: e.target.value }))}
            placeholder="e.g. a SaaS dashboard for freelancers to track invoices"
            className="w-full rounded-xl bg-background px-4 py-3 text-sm text-foreground ring-1 ring-hairline outline-none focus:ring-accent/50"
          />
        </Field>
      )}

      {step === 1 && (
        <Field label="What is the center of gravity?" hint="Pick the one that describes the core of the product.">
          <div className="grid gap-2 sm:grid-cols-2">
            {COG_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, centerOfGravity: o.value }))}
                className={`rounded-xl px-4 py-3 text-left ring-1 transition-colors ${
                  answers.centerOfGravity === o.value
                    ? "bg-accent-wash ring-accent"
                    : "ring-hairline hover:ring-foreground/20"
                }`}
              >
                <span className="block text-sm font-medium text-foreground">{o.label}</span>
                <span className="mt-0.5 block text-xs text-muted">{o.hint}</span>
              </button>
            ))}
          </div>
        </Field>
      )}

      {step === 2 && (
        <Field label="What will it need?" hint="Select all that apply. This decides which setup sections you get.">
          <div className="grid gap-2 sm:grid-cols-2">
            {NEEDS_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => toggleNeed(o.value)}
                aria-pressed={answers.needs.includes(o.value)}
                className={`flex items-center gap-2 rounded-xl px-4 py-3 text-left text-sm ring-1 transition-colors ${
                  answers.needs.includes(o.value)
                    ? "bg-accent-wash text-foreground ring-accent"
                    : "text-muted ring-hairline hover:ring-foreground/20"
                }`}
              >
                <span aria-hidden className="text-accent">
                  {answers.needs.includes(o.value) ? "✓" : "+"}
                </span>
                {o.label}
              </button>
            ))}
          </div>
        </Field>
      )}

      {step === 3 && (
        <Field label="What scale are you planning for?" hint="This decides whether you get the scaling, CI/CD, and monitoring sections now.">
          <div className="grid gap-2">
            {([
              ["personal", "Personal / side project", "Ship it, keep it cheap. Skip the heavy ops for now."],
              ["growing", "Growing product", "Real users coming. Solid defaults, room to scale."],
              ["serious", "Serious / production", "Include scaling, CI/CD with environments, and monitoring."],
            ] as const).map(([v, label, hint]) => (
              <button
                key={v}
                type="button"
                onClick={() => setAnswers((a) => ({ ...a, scale: v }))}
                className={`rounded-xl px-4 py-3 text-left ring-1 transition-colors ${
                  answers.scale === v ? "bg-accent-wash ring-accent" : "ring-hairline hover:ring-foreground/20"
                }`}
              >
                <span className="block text-sm font-medium text-foreground">{label}</span>
                <span className="mt-0.5 block text-xs text-muted">{hint}</span>
              </button>
            ))}
          </div>
        </Field>
      )}

      {step === 4 && (
        <div>
          {/* Verdict */}
          <div
            className={`rounded-xl p-5 ring-1 ${
              verdict.tone === "wrong" ? "bg-accent-wash ring-accent/40" : "bg-surface ring-hairline"
            }`}
          >
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
              <span aria-hidden>{verdict.tone === "wrong" ? "!" : "✓"}</span> Fit check
            </p>
            <p className="mt-2 text-base font-semibold text-foreground">{verdict.headline}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{verdict.body}</p>
            {verdict.reach && (
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">{verdict.reach}</p>
            )}
          </div>

          {verdict.tone !== "wrong" && (
            <p className="mt-4 text-sm text-muted">
              Your tailored prompt includes:{" "}
              <span className="text-foreground">
                {relevantSlugs(answers)
                  .map((s) => knowledge[s]?.title)
                  .filter(Boolean)
                  .join(", ")}
              </span>
              .
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={copyPrompt}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent-hover"
            >
              <span aria-hidden>{copied ? "✓" : "▸"}</span>
              {copied ? "Copied your setup prompt" : "Copy my tailored prompt"}
            </button>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground"
            >
              Start over
            </button>
          </div>
        </div>
      )}

      {/* Nav */}
      {step < 4 && (
        <div className="mt-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="font-mono text-xs uppercase tracking-wider text-muted transition-colors hover:text-foreground disabled:opacity-40"
          >
            Back
          </button>
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            className="inline-flex min-h-[40px] items-center gap-2 rounded-md bg-foreground px-4 py-2 font-mono text-xs font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
          >
            {step === 3 ? "See the verdict" : "Next"}
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="display text-xl text-foreground">{label}</h2>
      <p className="mt-1 mb-5 text-sm text-muted">{hint}</p>
      {children}
    </div>
  );
}
