import type { Metadata } from "next";
import Link from "next/link";
import {
  SKILLS,
  SKILLS_PLUGIN,
  SKILLS_MARKETPLACE,
  SKILLS_MARKETPLACE_NAME,
} from "@/lib/docs/skills";
import { abs } from "@/lib/site";
import { SkillsConstellation } from "@/components/docs/skills-constellation";
import { SkillsGallery } from "@/components/docs/skills-gallery";

export const metadata: Metadata = {
  title: "Skills",
  description:
    "Selwyn's process, packaged as installable Claude Code skills: plan with discovery to PRD, scaffold a Next.js app, check writing against the anti-slop rules, verify rendered output before shipping, and more. Install straight into your agent.",
};

/**
 * The Skills marketplace: a shelf of installable Claude Code skills generated
 * from the SKILLS catalog. The page is the storefront (browse, copy install);
 * the git repo is the warehouse an agent installs from. Static, no backend.
 */
export default function SkillsPage() {
  const skills = SKILLS;

  return (
    <div className="py-16 sm:py-20">
      {/* Intro stays at the readable measure; only the gallery below breaks
          full-width. lg:pl-20 clears the floating world-switcher rail (fixed
          at left-4, visible from lg: up). */}
      <header className="mx-auto mb-12 max-w-6xl border-b border-hairline px-4 pb-10 sm:px-6 lg:pl-20 lg:pr-6">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-subtle">
          The Marketplace
        </p>
        <h1 className="display mt-4 text-4xl text-foreground sm:text-5xl">
          Skills you can <span className="text-accent">install</span>
        </h1>
        <p className="measure mt-5 text-lg leading-relaxed text-muted">
          The handbook tells an AI how I work. These package it so an AI can
          just do it. Each skill is an installable Claude Code capability,
          from planning and scaffolding to writing, quality checks, and
          session hygiene, that drops into your agent and runs the way I
          would.
        </p>

        {/* How install actually works: git-based, one line. */}
        <div className="measure mt-8 rounded-xl bg-surface p-5 ring-1 ring-hairline">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            <span aria-hidden>▸</span> How to install
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Skills install from a git marketplace, not a download. In Claude
            Code, add the marketplace once and install the plugin, then run any
            skill by name:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-background px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground ring-1 ring-hairline">
            <span className="text-accent">/plugin</span> marketplace add{" "}
            {SKILLS_MARKETPLACE}
            {"\n"}
            <span className="text-accent">/plugin</span> install {SKILLS_PLUGIN}
            @{SKILLS_MARKETPLACE_NAME}
            {"\n"}
            <span className="text-subtle">
              # then run: /{SKILLS_PLUGIN}:&lt;name&gt;
            </span>
          </pre>
          <p className="mt-3 text-xs leading-relaxed text-subtle">
            Every card has a one-click install command on its detail page.
            Agents can read the index at{" "}
            <a
              href={abs("/llms.txt")}
              className="font-mono text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
            >
              /llms.txt
            </a>
            , or browse the whole{" "}
            <Link
              href="/docs"
              className="text-muted underline decoration-hairline underline-offset-2 hover:text-foreground"
            >
              handbook
            </Link>{" "}
            these are drawn from.
          </p>
        </div>
      </header>

      {/* The constellation is the browse surface on md+ (a two-level radial
          tree with the electric-current connectors). Narrow screens get the
          rail gallery, which already reads well when stacked. */}
      <div className="hidden md:block">
        <SkillsConstellation skills={skills} />
      </div>
      <div className="md:hidden">
        <SkillsGallery skills={skills} />
      </div>
    </div>
  );
}
