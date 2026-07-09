"use client";

import { useMemo, useState, useId } from "react";
import Link from "next/link";
import { CATEGORY_META, type Skill } from "@/lib/docs/skills";
import type { SkillCategory } from "@/lib/docs/types";

/**
 * The skills constellation: a two-level radial tree. A central hub branches to
 * six category nodes, and each category branches to its skill leaves. Connector
 * lines carry a continuous outward "current" pulse (animated stroke-dashoffset,
 * GPU-cheap, disabled under prefers-reduced-motion via the CSS in globals).
 *
 * Why SVG + HTML overlay: the LINES are SVG (paths animate cleanly), the NODES
 * are absolutely-positioned HTML (crisp text, real focus/hover, accessible
 * links, popovers) layered on top at the same computed coordinates. One
 * viewBox-to-percent mapping keeps them aligned as the canvas scales.
 *
 * Pure presentation. All skill data arrives as props from the server page; this
 * component computes only geometry and hover state, no business logic.
 */

/** Journey order for the category arms, matches the rails' CATEGORY_ORDER. */
const CATEGORY_ORDER: SkillCategory[] = [
  "plan",
  "build",
  "security",
  "quality",
  "content",
  "ops",
];

/** Category tint (1-5) to a red-family color, matched to the card system. */
const TINT_COLOR: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: "color-mix(in oklab, var(--color-red-600) 55%, var(--color-neutral-600))",
  2: "color-mix(in oklab, var(--color-red-600) 78%, var(--color-neutral-500))",
  3: "var(--color-red-600)",
  4: "var(--color-red-500)",
  5: "var(--color-red-400)",
};

// Canvas is a square SVG user space; nodes are placed in it, then everything
// is mapped to percentages so the HTML overlay tracks the SVG as it scales.
// The skill ring is kept inside a margin so leaf nodes (and their labels) never
// clip the canvas edge; the HTML overlay reserves that margin as padding.
const VB = 1000; // viewBox size
const C = VB / 2; // center
const R_CATEGORY = 230; // category ring radius
const R_SKILL = 388; // skill leaf ring radius (arc off each category)

type Pt = { x: number; y: number };

// Round every derived coordinate to a fixed precision. Without this, cos/sin
// can yield values whose string form differs between the server and client
// render (e.g. 499.99999997 vs 500), which trips React's hydration check on
// the SVG line attributes. Rounding makes the serialized output identical.
const round = (n: number) => Math.round(n * 100) / 100;

const polar = (angleDeg: number, radius: number): Pt => {
  const a = (angleDeg - 90) * (Math.PI / 180); // -90 so 0deg points up
  return { x: round(C + radius * Math.cos(a)), y: round(C + radius * Math.sin(a)) };
};

const pct = (v: number) => `${round((v / VB) * 100)}%`;

interface CategoryArm {
  category: SkillCategory;
  label: string;
  tint: 1 | 2 | 3 | 4 | 5;
  at: Pt;
  angle: number;
  skills: { skill: Skill; at: Pt }[];
}

export function SkillsConstellation({ skills }: { skills: Skill[] }) {
  const gradId = useId().replace(/:/g, "");
  const [hover, setHover] = useState<string | null>(null);

  // Build the arms: distribute categories evenly around the ring, then fan
  // each category's skills into a small arc centered on that category's angle.
  const arms = useMemo<CategoryArm[]>(() => {
    const present = CATEGORY_ORDER.filter((cat) =>
      skills.some((s) => s.category === cat),
    );
    const step = 360 / present.length;

    return present.map((category, i) => {
      const angle = i * step;
      const at = polar(angle, R_CATEGORY);
      const catSkills = skills.filter((s) => s.category === category);

      // Fan skills across an arc; ~20deg per skill so crowded arms (Quality
      // has 5) spread wide enough that leaf labels never collide, capped just
      // under the neighbouring arm's angle so arms don't overlap.
      const spread = Math.min(step * 0.92, 21 * (catSkills.length - 1) + 4);
      const start = angle - spread / 2;
      const inc = catSkills.length > 1 ? spread / (catSkills.length - 1) : 0;

      return {
        category,
        label: CATEGORY_META[category].label,
        tint: CATEGORY_META[category].tint,
        at,
        angle,
        skills: catSkills.map((skill, j) => ({
          skill,
          at: polar(catSkills.length > 1 ? start + j * inc : angle, R_SKILL),
        })),
      };
    });
  }, [skills]);

  const hub: Pt = { x: C, y: C };

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4">
      {/* The inner canvas holds the coordinate system; the p-[7%] gutter keeps
          leaf nodes and their labels off the container edge, since nodes are
          positioned by center at the skill ring radius. */}
      <div className="relative aspect-square w-full p-[7%]">
       <div className="relative h-full w-full">
        {/* ---- SVG line layer: hub->category and category->skill, with pulse ---- */}
        <svg
          viewBox={`0 0 ${VB} ${VB}`}
          className="absolute inset-0 h-full w-full overflow-visible"
          aria-hidden
          fill="none"
        >
          <defs>
            <radialGradient id={`${gradId}-core`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-red-500)" stopOpacity="0.5" />
              <stop offset="45%" stopColor="var(--color-red-600)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--color-red-600)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Faint hub aura, tighter and softer so it reads as a glow, not a smudge */}
          <circle cx={C} cy={C} r={115} fill={`url(#${gradId}-core)`} className="constellation-aura" />

          {arms.map((arm) => {
            const armActive =
              hover === `cat:${arm.category}` ||
              arm.skills.some((s) => hover === `skill:${s.skill.name}`);
            return (
              <g key={arm.category}>
                {/* hub -> category */}
                <ConnectorLine
                  from={hub}
                  to={arm.at}
                  color={TINT_COLOR[arm.tint]}
                  active={armActive}
                  delay={arm.angle / 360}
                />
                {/* category -> each skill */}
                {arm.skills.map((s, k) => (
                  <ConnectorLine
                    key={s.skill.name}
                    from={arm.at}
                    to={s.at}
                    color={TINT_COLOR[arm.tint]}
                    active={armActive || hover === `skill:${s.skill.name}`}
                    delay={(arm.angle / 360 + k * 0.13) % 1}
                  />
                ))}
              </g>
            );
          })}
        </svg>

        {/* ---- HTML node layer: hub, categories, skills ---- */}
        <div className="absolute inset-0">
          {/* Hub */}
          <NodeShell at={hub} size={96}>
            <div className="flex h-full w-full flex-col items-center justify-center rounded-full bg-surface text-center ring-1 ring-accent-ring shadow-soft-lg">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
                Selwyn
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
                Handbook
              </span>
            </div>
          </NodeShell>

          {/* Category nodes */}
          {arms.map((arm) => (
            <NodeShell key={arm.category} at={arm.at} size={72}>
              <div
                className="flex h-full w-full items-center justify-center rounded-full bg-background text-center ring-1 shadow-soft-md transition-transform duration-200"
                style={{
                  borderColor: TINT_COLOR[arm.tint],
                  boxShadow: `0 0 0 1px ${TINT_COLOR[arm.tint]}`,
                }}
              >
                <span className="px-1 text-[11px] font-semibold leading-tight text-foreground">
                  {arm.label}
                </span>
              </div>
            </NodeShell>
          ))}

          {/* Skill leaf nodes */}
          {arms.flatMap((arm) =>
            arm.skills.map((s) => (
              <SkillNode
                key={s.skill.name}
                skill={s.skill}
                at={s.at}
                color={TINT_COLOR[arm.tint]}
                hovered={hover === `skill:${s.skill.name}`}
                onEnter={() => setHover(`skill:${s.skill.name}`)}
                onLeave={() => setHover(null)}
              />
            )),
          )}
        </div>
       </div>
      </div>
    </div>
  );
}

/** One connector: a base hairline plus an animated pulse overlay. */
function ConnectorLine({
  from,
  to,
  color,
  active,
  delay,
}: {
  from: Pt;
  to: Pt;
  color: string;
  active: boolean;
  delay: number;
}) {
  return (
    <>
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={active ? 2.4 : 1.4}
        strokeOpacity={active ? 0.85 : 0.28}
        strokeLinecap="round"
        style={{ transition: "stroke-opacity 200ms, stroke-width 200ms" }}
      />
      {/* The travelling "current": a short dash that marches outward. */}
      <line
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={color}
        strokeWidth={active ? 3 : 2}
        strokeLinecap="round"
        strokeDasharray="6 60"
        className="constellation-pulse"
        style={{
          animationDelay: `${-delay * 2.2}s`,
          opacity: active ? 0.95 : 0.5,
        }}
      />
    </>
  );
}

/** Positions a fixed-size node centered on a viewBox point via percentages. */
function NodeShell({
  at,
  size,
  children,
}: {
  at: Pt;
  size: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(at.x), top: pct(at.y), width: size, height: size }}
    >
      {children}
    </div>
  );
}

/** A skill leaf: mark tile, zoom-on-hover, tooltip popup, link to detail page. */
function SkillNode({
  skill,
  at,
  color,
  hovered,
  onEnter,
  onLeave,
}: {
  skill: Skill;
  at: Pt;
  color: string;
  hovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  // Popup opens toward the center so it never runs off the canvas edge.
  const towardTop = at.y > C;

  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(at.x), top: pct(at.y), width: 56, height: 56, zIndex: hovered ? 30 : 10 }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <Link
        href={`/skills/${skill.name}`}
        onFocus={onEnter}
        onBlur={onLeave}
        aria-label={`${skill.title}: ${skill.blurb}`}
        className="group relative block h-full w-full rounded-full outline-none"
      >
        <span
          className={`flex h-full w-full items-center justify-center rounded-full bg-surface shadow-soft-sm transition-transform duration-200 group-hover:scale-125 group-focus-visible:scale-125 ${
            hovered ? "scale-125" : ""
          }`}
          style={
            hovered
              ? { boxShadow: `0 0 0 2px ${color}, 0 0 20px -2px ${color}` }
              : // Resting: a thin category-tinted ring so leaves read as
                // colored by category, not flat grey, without flooding.
                { boxShadow: `0 0 0 1.5px color-mix(in oklab, ${color} 45%, transparent)` }
          }
        >
          <span className="display text-base text-foreground/70">{skill.mark}</span>
          {!skill.verified && (
            <span
              aria-hidden
              className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-background ring-2"
              style={{ color }}
            />
          )}
        </span>

        {/* Hover/focus tooltip popup */}
        <span
          role="tooltip"
          className={`pointer-events-none absolute left-1/2 z-40 w-52 -translate-x-1/2 rounded-xl bg-background/95 p-3 text-left shadow-soft-lg ring-1 ring-hairline backdrop-blur-sm transition-all duration-150 ${
            hovered ? "opacity-100" : "opacity-0"
          } ${towardTop ? "bottom-full mb-3" : "top-full mt-3"}`}
        >
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="truncate text-[13px] font-semibold text-foreground">
              {skill.title}
            </span>
          </span>
          <span className="mt-1 block text-[11px] leading-snug text-muted">
            {skill.blurb}
          </span>
          <span className="mt-2 block font-mono text-[9px] uppercase tracking-wider text-accent">
            Click to open
          </span>
        </span>
      </Link>
    </div>
  );
}
