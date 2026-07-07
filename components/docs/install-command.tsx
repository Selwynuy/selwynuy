"use client";

import { useState } from "react";
import { SKILLS_PLUGIN } from "@/lib/docs/skills";

/**
 * The install control for a marketplace skill. Copies the Claude Code commands
 * that add the git marketplace and install the plugin, since that is how skills
 * actually install (git-based, one plugin holds all the skills, not an HTTP
 * download). The invoke line for this specific skill is appended as a comment so
 * the user knows how to run it. `size` picks the card or detail treatment.
 */
export function InstallCommand({
  name,
  marketplace,
  size = "card",
}: {
  /** Skill name, e.g. "discovery-to-prd". Used for the invoke hint. */
  name: string;
  /** The owner/repo passed to `/plugin marketplace add`. */
  marketplace: string;
  size?: "card" | "detail";
}) {
  const [copied, setCopied] = useState(false);

  const command =
    `/plugin marketplace add ${marketplace}\n` +
    `/plugin install ${SKILLS_PLUGIN}\n` +
    `# then run: /${SKILLS_PLUGIN}:${name}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked; nothing to fall back to for a command, leave state.
    }
  }

  if (size === "detail") {
    return (
      <div className="rounded-xl bg-surface ring-1 ring-hairline">
        <div className="flex items-center justify-between border-b border-hairline px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
            Install
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted transition-colors hover:text-accent"
          >
            <span aria-hidden>{copied ? "✓" : "▸"}</span>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground">
          <span className="text-accent">/plugin</span> marketplace add {marketplace}
          {"\n"}
          <span className="text-accent">/plugin</span> install {SKILLS_PLUGIN}
          {"\n"}
          <span className="text-subtle"># then run: /{SKILLS_PLUGIN}:{name}</span>
        </pre>
      </div>
    );
  }

  // Card treatment: a single full-width pill button that copies the command.
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy the command to install the ${name} skill`}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover"
    >
      <span aria-hidden>{copied ? "✓" : "▸"}</span>
      {copied ? "Command copied" : "Install skill"}
    </button>
  );
}
