"use client";

import { useState } from "react";

/**
 * The headline one-drop control: copies the ENTIRE playbook as a single
 * self-contained AI prompt (methodology embedded inline, so an AI without
 * browsing still gets everything). The text is built server-side and passed in.
 */
export function CopyPlaybook({
  playbook,
  fullUrl,
  wordCount,
}: {
  playbook: string;
  fullUrl: string;
  wordCount: number;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(playbook);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.open(fullUrl, "_blank", "noopener");
    }
  }

  return (
    <div className="rounded-xl bg-surface-raised p-5 ring-1 ring-hairline sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        <span aria-hidden>▸</span> Build with my whole method
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One click copies the entire handbook as a single prompt: architecture,
        security, integrations, CI/CD, and the rest, ready to paste into your AI
        so it scaffolds a project the way I would.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={copy}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <span aria-hidden>{copied ? "✓" : "▸"}</span>
          {copied ? "Copied the playbook" : "Copy entire playbook"}
        </button>
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs text-muted underline decoration-hairline underline-offset-2 transition-colors hover:text-foreground"
        >
          or open the raw version
        </a>
      </div>
      <p className="mt-3 font-mono text-[10px] text-subtle">
        ~{wordCount.toLocaleString()} words. If your AI can browse, the raw link
        is lighter; otherwise paste the copied text directly.
      </p>
    </div>
  );
}
