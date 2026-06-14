import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Tutorial primitives for handbook pages. Registered globally in
 * mdx-components.tsx so authors use them in MDX without imports. Brand-consistent
 * (red accents, near-black surfaces), accessible, and motion-free.
 */

/* ── Decision list: a checklist where each item branches Yes / No ──────────
   A "first match wins" decision tree. Each row is a numbered question with two
   clearly-marked branches: YES is the match (accent, this is your answer and you
   stop) and NO continues to the next question. The eye lands on the verdict
   instead of parsing prose. Use <DecisionList> as the wrapper and <Decision>
   per item; the final catch-all uses `verdict`. */

export function DecisionList({ children }: { children: ReactNode }) {
  return (
    <div className="my-7 overflow-hidden rounded-xl ring-1 ring-hairline [counter-reset:decision] [&>*+*]:border-t [&>*+*]:border-hairline">
      {children}
    </div>
  );
}

export function Decision({
  q,
  yes,
  no,
  verdict,
}: {
  /** The question. */
  q: string;
  /** What to do if the answer is yes (the match: this branch ends the checklist). */
  yes?: string;
  /** What to do if the answer is no (usually continue to the next question). */
  no?: string;
  /** If set, this is the terminal catch-all row: a single conclusion, no branches. */
  verdict?: string;
}) {
  if (verdict) {
    return (
      <div className="flex items-start gap-3.5 bg-accent-wash px-4 py-4 sm:px-5">
        <span
          aria-hidden
          className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent font-mono text-[11px] font-semibold text-accent-foreground"
        >
          ✓
        </span>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
            Otherwise
          </p>
          <p className="mt-1 font-medium text-foreground">{verdict}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface px-4 py-4 [counter-increment:decision] sm:px-5">
      <p className="flex items-start gap-3.5 font-medium text-foreground">
        <span
          aria-hidden
          className="mt-px flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface-raised font-mono text-[11px] font-semibold text-subtle ring-1 ring-hairline before:content-[counter(decision)] before:tabular-nums"
        />
        <span className="min-w-0">{q}</span>
      </p>
      <div className="mt-3 grid gap-2 pl-[2.375rem] sm:grid-cols-2">
        {yes && (
          <div className="flex items-baseline gap-2 rounded-lg bg-accent-wash px-3 py-2 ring-1 ring-accent/25">
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-accent">
              Yes
            </span>
            <span className="text-sm text-foreground/90">{yes}</span>
          </div>
        )}
        {no && (
          <div className="flex items-baseline gap-2 rounded-lg bg-surface-raised px-3 py-2 ring-1 ring-hairline">
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase tracking-wider text-subtle">
              No
            </span>
            <span className="text-sm text-muted">{no}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Rules: context-triggered AI directives (trigger -> rule -> code) ───────
   Each card states the CONTEXT to watch for (trigger), the RULE to apply, and a
   code snippet. Written so the one-drop bundle converts them into crisp
   CLAUDE.md-style directives ("WHEN x: do y"). Use <Rules> as the wrapper and
   <RuleCard trigger="..." rule="...">code fence</RuleCard> per item. */

export function Rules({ children }: { children: ReactNode }) {
  return <div className="my-7 space-y-3">{children}</div>;
}

export function RuleCard({
  trigger,
  rule,
  children,
}: {
  /** The context that should make the AI apply this rule. */
  trigger: string;
  /** The directive to follow when the trigger matches. */
  rule: string;
  /** A code snippet showing the rule applied (optional). */
  children?: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-hairline">
      <div className="space-y-2.5 bg-surface px-4 py-3.5 sm:px-5">
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="shrink-0 rounded bg-accent px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-accent-foreground">
            When
          </span>
          <span className="font-medium text-foreground">{trigger}</span>
        </p>
        <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="shrink-0 rounded bg-foreground/[0.08] px-1.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-muted">
            Do
          </span>
          <span className="text-sm text-muted">{rule}</span>
        </p>
      </div>
      {children && (
        <div className="border-t border-hairline [&_[data-rehype-pretty-code-figure]]:!my-0 [&_[data-rehype-pretty-code-figure]]:!rounded-none [&_[data-rehype-pretty-code-figure]]:!border-0 [&_[data-rehype-pretty-code-figure]]:!shadow-none [&_.code-copy]:!hidden [&_pre]:!my-0 [&_pre]:!rounded-none">
          {children}
        </div>
      )}
    </div>
  );
}

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
  // lets the inner code blocks shrink and wrap inside their own card rather
  // than blowing out the grid.
  return (
    <div className="my-6 grid items-start gap-3 sm:grid-cols-2">{children}</div>
  );
}

/*
  Each Compare card is ONE cohesive code panel that follows the active theme
  (light surface in light mode, near-black in dark mode, via --code-bg), so the
  card, header and code share one surface with no white-card / dark-code seams.
  The inner figure is flattened onto that shared surface: transparent
  background, no own border/radius/shadow, own filename header hidden in favour
  of the Avoid/Prefer bar. When a side stacks MULTIPLE code blocks, a thin
  divider (--code-divider) separates them instead of leaving a void (filenames
  live in the code as comments, so no separate caption is needed). Code wraps,
  never scrolls: a horizontal scrollbar in a side-by-side comparison hides half
  the point.
*/
const compareInner = [
  "min-w-0 px-1 pb-1.5",
  // Flatten every figure onto the card's own surface.
  "[&_[data-rehype-pretty-code-figure]]:!my-0",
  "[&_[data-rehype-pretty-code-figure]]:!rounded-none",
  "[&_[data-rehype-pretty-code-figure]]:!border-0",
  "[&_[data-rehype-pretty-code-figure]]:!bg-transparent",
  "[&_[data-rehype-pretty-code-figure]]:!shadow-none",
  // Hide the always-visible copy button and the dot+filename title bar; the
  // Avoid/Prefer header carries the chrome here.
  "[&_.code-copy]:!hidden",
  "[&_[data-rehype-pretty-code-title]]:!hidden",
  // Stacked figures: a theme-aware divider between them, no dark gap.
  "[&_[data-rehype-pretty-code-figure]+[data-rehype-pretty-code-figure]]:border-t",
  "[&_[data-rehype-pretty-code-figure]+[data-rehype-pretty-code-figure]]:border-[var(--code-divider)]",
  "[&_pre]:!my-0 [&_pre]:!rounded-none [&_pre]:!bg-transparent",
  // Wrap, do not scroll: smaller code, soft-wrapped long lines.
  "[&_pre]:!overflow-x-hidden [&_pre]:text-[0.78rem] [&_pre]:leading-relaxed",
  "[&_pre_code]:!whitespace-pre-wrap [&_pre_code]:[word-break:break-word]",
  "[&_[data-line]]:!whitespace-pre-wrap",
].join(" ");

// The card surface follows the active code theme; a coloured ring keeps Avoid
// (red) and Prefer (neutral) distinct without a jarring fill.
const compareCard =
  "min-w-0 overflow-hidden rounded-xl bg-[var(--code-bg)] shadow-soft-md";

export function Bad({ children }: { children: ReactNode }) {
  return (
    <div className={`${compareCard} ring-1 ring-accent/40`}>
      <p className="flex items-center gap-2 border-b border-[var(--code-border)] bg-accent-wash px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        <span aria-hidden className="text-[11px] leading-none">✕</span> Avoid
      </p>
      <div className={compareInner}>{children}</div>
    </div>
  );
}

export function Good({ children }: { children: ReactNode }) {
  return (
    <div className={`${compareCard} ring-1 ring-[var(--code-border)]`}>
      <p className="flex items-center gap-2 border-b border-[var(--code-border)] bg-[var(--code-header-bg)] px-3.5 py-2 font-mono text-[10px] uppercase tracking-[0.15em] text-muted">
        <span aria-hidden className="text-[11px] leading-none text-foreground/60">✓</span> Prefer
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
