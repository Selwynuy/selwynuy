"use client";

import { useState } from "react";

/**
 * The headline one-drop control. The primary action copies a short BOOTSTRAP
 * instruction: it tells the user's coding agent to fetch /claude.md and write
 * it into their project as CLAUDE.md, so future sessions inherit the rules.
 * Secondary actions cover the offline case (copy the full playbook inline) and
 * inspection (view the raw CLAUDE.md). All text is built server-side.
 */
export function CopyPlaybook({
  bootstrap,
  playbook,
  claudeMdUrl,
  fullUrl,
  wordCount,
}: {
  /** Short fetch-and-save instruction (the primary copy). */
  bootstrap: string;
  /** The entire playbook inline (offline fallback). */
  playbook: string;
  /** Absolute URL of the /claude.md rules file. */
  claudeMdUrl: string;
  /** Absolute URL of /llms-full.txt (raw full handbook). */
  fullUrl: string;
  /** Word count of the inline playbook, shown on the inline option. */
  wordCount: number;
}) {
  const [copied, setCopied] = useState<null | "bootstrap" | "inline">(null);

  async function copy(which: "bootstrap" | "inline") {
    const text = which === "bootstrap" ? bootstrap : playbook;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 2500);
    } catch {
      window.open(which === "bootstrap" ? claudeMdUrl : fullUrl, "_blank", "noopener");
    }
  }

  return (
    <div className="rounded-xl bg-surface-raised p-5 ring-1 ring-hairline sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        <span aria-hidden>▸</span> Set up my CLAUDE.md
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        One click copies an instruction for your coding agent. Paste it into your
        terminal and the agent fetches my whole ruleset and writes it into your
        project as a <code className="rounded bg-surface px-1 py-0.5 font-mono text-[0.85em] text-foreground/90 ring-1 ring-hairline">CLAUDE.md</code>,
        so every future session builds the way I would.
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => copy("bootstrap")}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-md bg-accent px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent-hover"
        >
          <span aria-hidden>{copied === "bootstrap" ? "✓" : "▸"}</span>
          {copied === "bootstrap" ? "Copied, paste in your terminal" : "Copy for AI"}
        </button>
        <a
          href={claudeMdUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="font-mono text-xs text-muted underline decoration-hairline underline-offset-2 transition-colors hover:text-foreground"
        >
          preview the CLAUDE.md
        </a>
      </div>

      {/* What the agent will run, shown so it's not a black box. Wraps rather
          than scrolls so the whole instruction is readable at a glance. */}
      <pre className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-surface px-3 py-2.5 font-mono text-[11px] leading-relaxed text-muted ring-1 ring-hairline">
        {bootstrap}
      </pre>

      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
        <button
          type="button"
          onClick={() => copy("inline")}
          className="font-mono text-[10px] uppercase tracking-wider text-subtle underline decoration-hairline underline-offset-2 transition-colors hover:text-foreground"
        >
          {copied === "inline" ? "Copied the full playbook" : "Or copy the full playbook inline"}
        </button>
        <span className="font-mono text-[10px] text-subtle">
          for an AI that can&apos;t browse (~{wordCount.toLocaleString()} words).
        </span>
      </div>
    </div>
  );
}
