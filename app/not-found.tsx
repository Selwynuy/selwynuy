import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "404, Page not found",
  description: "The page you are looking for does not exist.",
};

/**
 * Branded 404. Renders inside the root layout (header + footer chrome) and
 * reuses the hero's visual language: a giant ghost numeral behind the content,
 * dot-grid + glow atmosphere, and a terminal-style status line, so a wrong URL
 * still feels like part of the site instead of a dead end.
 */
export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-5 py-24 sm:px-6">
      {/* Atmosphere, same as the hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-dot-grid [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_25%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-glow"
      />

      {/* Oversized ghost 404 behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center"
      >
        <span className="block font-semibold leading-[0.8] tracking-tighter text-foreground/[0.04] [font-size:clamp(8rem,30vw,24rem)]">
          404
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5 font-mono text-xs text-muted shadow-soft-sm ring-1 ring-hairline">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          404, not found
        </p>

        <h1 className="display text-4xl text-foreground sm:text-5xl">
          This page took a wrong turn.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
          The URL does not match anything here. It may have moved, or never
          existed. Let&apos;s get you back to solid ground.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">Back to home</ButtonLink>
          <ButtonLink href="/docs" variant="ghost">
            Browse the handbook
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
