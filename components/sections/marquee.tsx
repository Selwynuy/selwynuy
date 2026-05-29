import { skills } from "@/lib/content/experience";

/**
 * Tasteful auto-scrolling skills marquee.
 * Pure CSS animation (reduced-motion safe); duplicated track for seamless loop.
 * Pauses on hover so recruiters can actually read it.
 */
export function Marquee() {
  const items = [...skills, ...skills]; // duplicate for seamless -50% loop

  return (
    <div className="relative overflow-hidden rule-y py-6">
      {/* edge fades so it dissolves into the page, not a hard cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-background to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-background to-transparent"
      />

      <ul className="group flex w-max animate-marquee items-center gap-3 hover:[animation-play-state:paused]">
        {items.map((skill, i) => (
          <li
            key={i}
            className="whitespace-nowrap rounded-full bg-foreground/[0.04] px-4 py-2 font-mono text-sm text-muted ring-1 ring-hairline"
          >
            {skill}
          </li>
        ))}
      </ul>
    </div>
  );
}
