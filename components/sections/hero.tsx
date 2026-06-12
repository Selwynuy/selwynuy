import { profile } from "@/lib/content/profile";
import { skills } from "@/lib/content/experience";
import { projects } from "@/lib/content/projects";
import { ButtonLink } from "@/components/ui/button";
import { TypingTerminal } from "@/components/sections/typing-terminal";

/**
 * Editorial × Technical hero with punch:
 * an oversized ghost wordmark behind layered content, a typing terminal
 * identity card, and atmospheric dot-grid + glow.
 */
/**
 * Render the hook with one accent word in brand red (poster style).
 * Highlights `profile.accentWord` if set, else the first occurrence of "secure".
 */
function renderHook(hook: string) {
  const accent = profile.accentWord ?? "secure";
  const idx = hook.toLowerCase().indexOf(accent.toLowerCase());
  if (idx === -1) return hook;
  return (
    <>
      {hook.slice(0, idx)}
      <span className="text-accent">{hook.slice(idx, idx + accent.length)}</span>
      {hook.slice(idx + accent.length)}
    </>
  );
}

export function Hero() {
  const firstName = profile.name.split(" ")[0].toLowerCase();

  return (
    <section id="top" className="relative isolate overflow-hidden">
      {/* Atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-dot-grid [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_25%,transparent_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 bg-glow" />

      {/* Oversized ghost wordmark, editorial depth behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[18%] -z-10 select-none text-center"
      >
        <span className="block font-semibold uppercase leading-[0.8] tracking-tighter text-foreground/[0.035] [font-size:clamp(5rem,22vw,20rem)]">
          {profile.name.split(" ")[0]}
        </span>
      </div>

      <div className="mx-auto grid max-w-5xl items-center gap-12 px-6 pb-24 pt-28 sm:pt-36 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
        {/* Left: editorial intro */}
        <div>
          <p
            className="reveal flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle"
            style={{ "--reveal-delay": "0ms" } as React.CSSProperties}
          >
            <span className="text-foreground">{profile.name}</span>
            <span className="h-px w-8 bg-hairline" />
            {profile.role}
          </p>

          {/* The hook IS the headline, poster voice, one accent word in brand red. */}
          <h1
            className="reveal display mt-6 text-balance text-display text-foreground"
            style={{ "--reveal-delay": "80ms" } as React.CSSProperties}
          >
            {renderHook(profile.hook)}
          </h1>

          <p
            className="reveal mt-5 max-w-xl text-balance text-lg leading-relaxed text-muted"
            style={{ "--reveal-delay": "160ms" } as React.CSSProperties}
          >
            {profile.subhook}
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

        {/* Right: typing terminal identity card */}
        <div
          className="reveal"
          style={{ "--reveal-delay": "320ms" } as React.CSSProperties}
        >
          <TypingTerminal
            title={`${firstName}@portfolio:~`}
            lines={[
              { prompt: true, text: "whoami", className: "text-subtle" },
              { text: profile.role, className: "text-foreground" },
              { prompt: true, text: "cat stack.txt", className: "text-subtle" },
              {
                text: skills.slice(0, 6).join("  "),
                className: "text-foreground/80",
              },
              {
                text: "● Available for work",
                className: "text-emerald-600 dark:text-emerald-400",
              },
            ]}
          />

          <dl className="mt-3 grid grid-cols-2 gap-3">
            <Stat k="Status" v="Open to roles" />
            <Stat k="Shipped" v={`${projects.length}+ projects`} />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface-raised px-4 py-3 shadow-soft-sm ring-1 ring-hairline">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-subtle">
        {k}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{v}</dd>
    </div>
  );
}
