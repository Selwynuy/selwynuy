import { profile } from "@/lib/content/profile";
import { skills } from "@/lib/content/experience";
import { projects } from "@/lib/content/projects";
import { ButtonLink } from "@/components/ui/button";

/**
 * Editorial × Technical hero.
 * Asymmetric: editorial heading + CTAs on the left, a terminal-style
 * identity card on the right. Dot-grid + glow atmosphere behind.
 */
export function Hero() {
  const firstName = profile.name.split(" ")[0];

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden"
    >
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-dot-grid [mask-image:radial-gradient(70%_60%_at_50%_0%,#000_30%,transparent_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-glow" />

      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 pt-28 sm:pt-36 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        {/* Left: editorial intro */}
        <div>
          <p
            className="reveal flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle"
            style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
          >
            <span className="text-foreground">01</span>
            <span className="h-px w-8 bg-hairline" />
            Developer
          </p>

          <h1
            className="reveal mt-6 text-display font-semibold text-foreground"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {profile.name}
          </h1>

          <p
            className="reveal mt-5 max-w-xl text-balance text-xl leading-relaxed text-muted"
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            {profile.tagline}
          </p>

          <div
            className="reveal mt-9 flex flex-wrap items-center gap-3"
            style={{ "--reveal-delay": "240ms" } as React.CSSProperties}
          >
            <ButtonLink href="#contact">Get in touch</ButtonLink>
            <ButtonLink href="#work" variant="ghost">
              View my work →
            </ButtonLink>
          </div>
        </div>

        {/* Right: terminal-style identity card */}
        <div
          className="reveal"
          style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
        >
          <div className="overflow-hidden rounded-2xl bg-surface-raised shadow-soft-lg ring-1 ring-hairline">
            {/* title bar */}
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
              <span className="ml-2 font-mono text-xs text-subtle">
                {firstName.toLowerCase()}@portfolio:~
              </span>
            </div>

            {/* body */}
            <div className="space-y-3 p-5 font-mono text-sm">
              <p className="text-subtle">
                <span className="text-foreground/60">$</span> whoami
              </p>
              <p className="text-foreground">{profile.role}</p>

              <p className="pt-1 text-subtle">
                <span className="text-foreground/60">$</span> cat stack.txt
              </p>
              <p className="flex flex-wrap gap-x-2 gap-y-1 text-foreground/80">
                {skills.slice(0, 6).map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-foreground/80">
                  Available for work
                </span>
              </div>
            </div>

            {/* footer stats */}
            <dl className="grid grid-cols-2 divide-x divide-hairline border-t border-hairline">
              <div className="px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                  Focus
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  Next.js · Security
                </dd>
              </div>
              <div className="px-5 py-4">
                <dt className="font-mono text-xs uppercase tracking-wider text-subtle">
                  Projects
                </dt>
                <dd className="mt-1 text-sm font-medium text-foreground">
                  {projects.length}+ shipped
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
