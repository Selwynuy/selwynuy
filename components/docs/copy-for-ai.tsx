"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The one-drop control. Sits at the top of each handbook page.
 * Primary button copies a ready-made prompt that points an AI at this section's
 * raw-markdown URL. The dropdown exposes the .md URL and prefilled deep links
 * to ChatGPT and Claude. This is the feature that makes the docs a tool.
 */
export function CopyForAI({
  title,
  mdUrl,
}: {
  /** Doc title, woven into the copy prompt. */
  title: string;
  /** Absolute URL of the /d/<slug>.md endpoint. */
  mdUrl: string;
}) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const prompt = `Read ${mdUrl} and apply the "${title}" guidance from Selwyn Uy's Next.js Handbook to my project.`;

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      // Defer state reset off the click handler (React Compiler friendly).
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: fall back to opening the raw markdown.
      window.open(mdUrl, "_blank", "noopener");
    }
    setOpen(false);
  }

  // Close the dropdown on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const chatgpt = `https://chatgpt.com/?q=${encodeURIComponent(prompt)}`;
  const claude = `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={copyPrompt}
        aria-label="Copy a prompt that applies this page with your AI"
        className="inline-flex items-center gap-2 rounded-l-md bg-accent px-3 py-1.5 font-mono text-xs font-medium uppercase tracking-wider text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        <span aria-hidden>{copied ? "✓" : "▸"}</span>
        {copied ? "Copied" : "Copy for AI"}
      </button>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="More one-drop options"
        className="rounded-r-md border-l border-black/20 bg-accent px-2 py-1.5 text-accent-foreground transition-colors hover:bg-accent-hover"
      >
        <span aria-hidden className="text-xs">
          ▾
        </span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-20 mt-1.5 w-56 overflow-hidden rounded-lg bg-surface-raised py-1 shadow-soft-lg ring-1 ring-hairline"
        >
          <a
            role="menuitem"
            href={mdUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/[0.05]"
            onClick={() => setOpen(false)}
          >
            View as Markdown
          </a>
          <a
            role="menuitem"
            href={chatgpt}
            target="_blank"
            rel="noreferrer noopener"
            className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/[0.05]"
            onClick={() => setOpen(false)}
          >
            Open in ChatGPT
          </a>
          <a
            role="menuitem"
            href={claude}
            target="_blank"
            rel="noreferrer noopener"
            className="block px-3 py-2 text-sm text-foreground transition-colors hover:bg-foreground/[0.05]"
            onClick={() => setOpen(false)}
          >
            Open in Claude
          </a>
        </div>
      )}
    </div>
  );
}
