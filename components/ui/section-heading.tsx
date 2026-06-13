/**
 * Numbered editorial section heading with a huge faint ghost number
 * as a background watermark, a recurring editorial motif across sections.
 */
export function SectionHeading({
  index,
  label,
  title,
  ghost,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  /** Big watermark numeral, e.g. "02". Defaults to `index`. */
  ghost?: string;
  /** Short framing line that gives this section its job in the storyline. */
  intro?: string;
}) {
  return (
    <header className="relative mb-12">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 -left-2 select-none font-semibold leading-none text-foreground/[0.04] [font-size:clamp(4rem,14vw,11rem)] -z-10"
      >
        {ghost ?? index}
      </span>
      <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle">
        <span className="text-foreground">{index}</span>
        <span className="h-px w-8 bg-hairline" />
        {label}
      </p>
      <h2 className="display mt-4 text-h2 text-foreground">{title}</h2>
      {intro && (
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
          {intro}
        </p>
      )}
    </header>
  );
}
