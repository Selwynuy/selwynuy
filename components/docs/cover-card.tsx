import type { CSSProperties, ReactNode } from "react";

interface CoverCardProps {
  /** Rendered width of the cover in px; all type scales from it, so the same
   *  cover renders correctly at any book size (hero, pricing, mobile). */
  width: number;
  kicker: string;
  title: string;
  /** Substring of `title` rendered in accent red, on its own line, mirroring
   *  the real cover's `<em>Foundations</em>`. */
  accentWord?: string;
  /** A short, single-line description. Real book covers don't carry a
   *  paragraph of body text, so this is deliberately brief. */
  sub?: string;
  /** Author/site + edition, mirrors the real cover's `.cover-meta`. */
  footer?: { left: ReactNode; right: string };
  className?: string;
  style?: CSSProperties;
}

/**
 * The book's front-cover face: near-black background, a diffuse red radial
 * blob, a condensed display title, a mono accent kicker. A live recreation of
 * content/guides/complete-parts/00-front.html's `.cover`, built from the raw
 * (never theme-swapped) ink/neutral/red tokens so it stays "always dark" like
 * a product photo, independent of the page theme. Type is sized from `width`
 * (not fixed classes, not container units) so it never clips at small sizes.
 */
export function CoverCard({
  width,
  kicker,
  title,
  accentWord,
  sub,
  footer,
  className = "",
  style,
}: CoverCardProps) {
  const px = (f: number) => `${Math.round(width * f)}px`;

  let titleNode: ReactNode = title;
  if (accentWord && title.includes(accentWord)) {
    const at = title.indexOf(accentWord);
    const before = title.slice(0, at).trim();
    const after = title.slice(at + accentWord.length).trim();
    titleNode = (
      <>
        {before && (
          <>
            {before}
            <br />
          </>
        )}
        <span style={{ color: "var(--color-red-600)" }}>{accentWord}</span>
        {after && (
          <>
            <br />
            {after}
          </>
        )}
      </>
    );
  }

  return (
    <div
      className={`relative flex h-full w-full flex-col overflow-hidden ${className}`}
      style={{
        background: "var(--color-ink-950)",
        color: "var(--color-neutral-50)",
        padding: px(0.08),
        ...style,
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/3 -bottom-1/4 h-2/3 w-2/3 rounded-full"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--color-red-600) 30%, transparent), transparent 70%)",
        }}
      />

      <p
        className="relative font-mono uppercase tracking-[0.32em]"
        style={{ color: "var(--color-red-600)", fontSize: px(0.026) }}
      >
        {kicker}
      </p>

      <h3
        className="display relative leading-[0.92]"
        style={{ marginTop: px(0.05), fontSize: px(0.135) }}
      >
        {titleNode}
      </h3>

      {sub && (
        <p
          className="relative leading-relaxed"
          style={{
            color: "var(--color-neutral-400)",
            marginTop: px(0.05),
            fontSize: px(0.036),
          }}
        >
          {sub}
        </p>
      )}

      {footer && (
        <div
          className="relative mt-auto flex items-end justify-between gap-3 border-t font-mono uppercase tracking-[0.18em]"
          style={{
            borderColor: "rgba(250, 250, 249, 0.14)",
            color: "var(--color-neutral-400)",
            paddingTop: px(0.04),
            fontSize: px(0.023),
          }}
        >
          <span>{footer.left}</span>
          <span>{footer.right}</span>
        </div>
      )}
    </div>
  );
}
