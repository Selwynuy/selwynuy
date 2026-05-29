import { skills } from "@/lib/content/experience";

/**
 * Dual-row skills marquee scrolling in opposite directions.
 * Pure CSS (reduced-motion safe); pauses on hover so it's readable.
 */
export function Marquee() {
  // Split skills across two rows for visual variety.
  const mid = Math.ceil(skills.length / 2);
  const rowA = skills.slice(0, mid);
  const rowB = skills.slice(mid);

  return (
    <div className="relative space-y-3 overflow-hidden rule-y py-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />

      <MarqueeRow items={rowA} direction="normal" />
      <MarqueeRow items={rowB} direction="reverse" />
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: string[];
  direction: "normal" | "reverse";
}) {
  const doubled = [...items, ...items];
  return (
    <ul
      className={`flex w-max items-center gap-3 hover:[animation-play-state:paused] ${
        direction === "reverse" ? "animate-marquee-reverse" : "animate-marquee"
      }`}
    >
      {doubled.map((skill, i) => (
        <li
          key={i}
          className="whitespace-nowrap rounded-full bg-surface-raised px-5 py-2.5 font-mono text-base text-foreground/80 shadow-soft-sm ring-1 ring-hairline"
        >
          {skill}
        </li>
      ))}
    </ul>
  );
}
