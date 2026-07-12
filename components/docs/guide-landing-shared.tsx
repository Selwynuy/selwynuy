import { GUIDES_EDITION, type Guide } from "@/lib/docs/guides";

/** Icon-tile gradient shared with the shelf card (components/docs/guide-card.tsx). */
export const GUIDE_MARK_TILE =
  "radial-gradient(120% 120% at 30% 20%, var(--color-red-500) 0%, var(--color-red-700) 75%)";

/** The buy/read anchor, factored out of BuyCard so other layouts (the sticky
 *  bar) can reuse the same checkout-vs-draft branching without duplicating it. */
export function BuyButton({
  guide,
  className = "",
}: {
  guide: Guide;
  className?: string;
}) {
  const { landing, pdf } = guide;
  const hasCheckout = Boolean(landing.buyUrl);
  return (
    <a
      href={hasCheckout ? landing.buyUrl : pdf}
      {...(hasCheckout
        ? { target: "_blank", rel: "noopener noreferrer" }
        : { download: true })}
      className={`inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-accent-foreground shadow-soft-sm transition-colors hover:bg-accent-hover ${className}`}
    >
      <span aria-hidden>▸</span> {hasCheckout ? "Get it now" : "Read the PDF"}
    </a>
  );
}

/** Price + call to action. A real buy button once buyUrl is set, otherwise a
 *  free-preview CTA while the guide is still in draft. */
export function BuyCard({ guide }: { guide: Guide }) {
  const { landing, pdf } = guide;
  const hasCheckout = Boolean(landing.buyUrl);
  return (
    <div className="rounded-2xl bg-surface p-6 ring-1 ring-hairline sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="display text-4xl leading-none text-foreground">
            {landing.price}
          </p>
          <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-subtle">
            {hasCheckout ? "one-time" : "launch price"}
          </p>
        </div>
        <p className="text-right font-mono text-[11px] leading-relaxed text-subtle">
          PDF · {landing.pages} pages
          <br />
          Edition {GUIDES_EDITION}
        </p>
      </div>

      <BuyButton guide={guide} className="mt-5 w-full" />

      {hasCheckout ? (
        <a
          href={pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block text-center font-mono text-[11px] text-muted underline decoration-hairline underline-offset-2 hover:text-foreground"
        >
          Preview the PDF first
        </a>
      ) : (
        <p className="mt-3 text-center font-mono text-[11px] text-subtle">
          Free to read while in preview. Checkout coming soon.
        </p>
      )}
    </div>
  );
}

/** A benefit list with accent check markers. */
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 space-y-3">
      {items.map((it) => (
        <li key={it} className="flex gap-3">
          <span
            aria-hidden
            className="mt-1 shrink-0 font-mono text-xs text-accent"
          >
            ✓
          </span>
          <span className="leading-relaxed text-muted">{it}</span>
        </li>
      ))}
    </ul>
  );
}

export function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-accent">
      {children}
    </h2>
  );
}
