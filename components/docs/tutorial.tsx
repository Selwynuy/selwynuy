import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Tutorial primitives for handbook pages. Registered globally in
 * mdx-components.tsx so authors use them in MDX without imports. Brand-consistent
 * (red accents, near-black surfaces), accessible, and motion-free.
 */

/* ── Steps: numbered vertical stepper with a connecting spine ───────────── */

export function Steps({ children }: { children: ReactNode }) {
  return (
    <div className="my-8 [counter-reset:step] [&>*]:relative">{children}</div>
  );
}

export function Step({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative border-l border-hairline pb-8 pl-8 last:border-transparent last:pb-0 [counter-increment:step]">
      {/* Numbered marker sitting on the spine */}
      <span
        aria-hidden
        className="absolute -left-[15px] top-0 flex h-7 w-7 items-center justify-center rounded-full bg-accent font-mono text-xs font-semibold text-accent-foreground before:content-[counter(step)]"
      />
      <h3 className="mt-0.5 mb-2 text-lg font-semibold text-foreground">
        {title}
      </h3>
      <div className="text-muted [&>*:first-child]:mt-0">{children}</div>
    </div>
  );
}

/* ── Prereqs: what you need before starting ─────────────────────────────── */

export function Prereqs({ children }: { children: ReactNode }) {
  return (
    <aside className="my-6 rounded-xl bg-surface px-5 py-4 ring-1 ring-hairline">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-subtle">
        <span aria-hidden>▸</span> Before you start
      </p>
      <div className="mt-2 text-sm text-muted [&_ul]:my-2 [&_ul]:ml-4 [&_ul]:list-disc [&_li]:my-1">
        {children}
      </div>
    </aside>
  );
}

/* ── Outcome: "you now have X" success box ──────────────────────────────── */

export function Outcome({ children }: { children: ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border-l-2 border-accent bg-accent-wash px-5 py-4">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
        <span aria-hidden>✓</span> You now have
      </p>
      <div className="mt-2 text-sm text-foreground/90 [&>*:first-child]:mt-0">
        {children}
      </div>
    </aside>
  );
}

/* ── Rule: pull-out do / don't rule ─────────────────────────────────────── */

export function Rule({
  type = "do",
  children,
}: {
  type?: "do" | "dont";
  children: ReactNode;
}) {
  const isDo = type === "do";
  return (
    <div
      className={`my-5 flex gap-3 rounded-lg px-4 py-3 ring-1 ${
        isDo
          ? "bg-surface ring-hairline"
          : "bg-accent-wash ring-accent/30"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 font-mono text-xs font-bold uppercase ${
          isDo ? "text-accent" : "text-accent"
        }`}
      >
        {isDo ? "Do" : "Don't"}
      </span>
      <div className="text-sm text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  );
}

/* ── Callout: note / warn / tip / security aside ────────────────────────── */

const calloutMeta: Record<string, { label: string; mark: string }> = {
  note: { label: "Note", mark: "i" },
  tip: { label: "Tip", mark: "★" },
  warn: { label: "Warning", mark: "!" },
  security: { label: "Security", mark: "⛨" },
};

export function Callout({
  type = "note",
  children,
}: {
  type?: "note" | "tip" | "warn" | "security";
  children: ReactNode;
}) {
  const meta = calloutMeta[type] ?? calloutMeta.note;
  const accent = type === "warn" || type === "security";
  return (
    <aside
      className={`my-6 flex gap-3 rounded-xl px-4 py-3 ring-1 ${
        accent ? "bg-accent-wash ring-accent/30" : "bg-surface ring-hairline"
      }`}
    >
      <span
        aria-hidden
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[11px] ${
          accent
            ? "bg-accent text-accent-foreground"
            : "bg-foreground/[0.08] text-muted"
        }`}
      >
        {meta.mark}
      </span>
      <div className="text-sm text-foreground/90 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        <span className="sr-only">{meta.label}: </span>
        {children}
      </div>
    </aside>
  );
}

/* ── Compare: wrong-way / right-way code pair ───────────────────────────── */

export function Compare({ children }: { children: ReactNode }) {
  // items-start keeps the two cards independent in height; min-w-0 on children
  // lets the inner code blocks shrink and scroll inside their own card rather
  // than blowing out the grid.
  return (
    <div className="my-6 grid items-start gap-3 sm:grid-cols-2">{children}</div>
  );
}

// Shared chrome so both halves of a Compare line up exactly. The inner figure
// is flattened (no own margin/border/radius), its own header is hidden so the
// Avoid/Prefer label is the single header, and code WRAPS instead of scrolling:
// a horizontal scrollbar in a side-by-side comparison hides half the point.
const compareInner = [
  "min-w-0",
  "[&_[data-rehype-pretty-code-figure]]:!my-0",
  "[&_[data-rehype-pretty-code-figure]]:!rounded-none",
  "[&_[data-rehype-pretty-code-figure]]:!border-0",
  "[&_[data-rehype-pretty-code-figure]]:!shadow-none",
  "[&_[data-rehype-pretty-code-title]]:!hidden",
  "[&_pre]:!my-0 [&_pre]:!rounded-none",
  // Wrap, do not scroll: smaller code, soft-wrapped long lines.
  "[&_pre]:!overflow-x-hidden [&_pre]:text-[0.78rem] [&_pre]:leading-relaxed",
  "[&_pre_code]:!whitespace-pre-wrap [&_pre_code]:[word-break:break-word]",
  "[&_[data-line]]:!whitespace-pre-wrap",
].join(" ");

export function Bad({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl ring-1 ring-accent/30">
      <p className="border-b border-accent/20 bg-accent-wash px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-accent">
        Avoid
      </p>
      <div className={compareInner}>{children}</div>
    </div>
  );
}

export function Good({ children }: { children: ReactNode }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl ring-1 ring-hairline">
      <p className="border-b border-hairline bg-surface px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-foreground/70">
        Prefer
      </p>
      <div className={compareInner}>{children}</div>
    </div>
  );
}

/* ── NextStep: continue-to footer link ──────────────────────────────────── */

export function NextStep({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="group my-8 flex items-center justify-between rounded-xl bg-surface-raised px-5 py-4 ring-1 ring-hairline transition-colors hover:ring-accent/40"
    >
      <span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
          Next
        </span>
        <span className="mt-0.5 block font-semibold text-foreground group-hover:text-accent">
          {children}
        </span>
      </span>
      <span aria-hidden className="text-accent transition-transform group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
