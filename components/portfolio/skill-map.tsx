"use client";

import { useEffect, useRef, useState } from "react";
import { inView } from "motion";
import { animate } from "motion/mini";
import {
  CodeXml,
  Database,
  GitBranch,
  Pause,
  Play,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";

const hub = { x: 180, y: 132 };
const branches = [
  {
    x: 76,
    y: 40,
    label: "Web",
    tool: "Next.js & React",
    glyph: CodeXml,
    detail:
      "I built CSE Exam Review’s timed practice exams and question navigation in Next.js.",
  },
  {
    x: 284,
    y: 40,
    label: "iOS",
    tool: "Swift",
    glyph: Smartphone,
    detail:
      "I build native iOS apps in Swift, from the first screen to a working app on the phone.",
  },
  {
    x: 314,
    y: 132,
    label: "Delivery",
    tool: "CI/CD & VPS",
    glyph: GitBranch,
    detail:
      "I use GitHub, CI/CD, and Hostinger VPS deployments to take changes from a commit to a live site.",
  },
  {
    x: 284,
    y: 223,
    label: "Security",
    tool: "Web & API testing",
    glyph: ShieldCheck,
    detail:
      "My VAPT background guides how I test access controls, validate inputs, and review APIs.",
  },
  {
    x: 76,
    y: 223,
    label: "AI tools",
    tool: "Claude Code & Codex",
    glyph: Terminal,
    detail:
      "I use Claude Code and Codex to explore implementations, then review and test what ships.",
  },
  {
    x: 46,
    y: 132,
    label: "Data",
    tool: "Supabase",
    glyph: Database,
    detail:
      "I work with Supabase and PostgreSQL to connect interfaces to the data behind them.",
  },
];

function startSignals(svg: SVGSVGElement) {
  const timeline = [];
  for (const [index, node] of svg
    .querySelectorAll<SVGGElement>(".pf-map-branch")
    .entries()) {
    const { x, y } = branches[index];
    const distance = Math.hypot(x - hub.x, y - hub.y) - 28;
    const travel = (offset: number) => `translateX(${offset}px)`;
    const timing = {
      duration: 4.8,
      delay: index * 0.8,
      repeat: Infinity,
      ease: "linear" as const,
    };
    timeline.push(
      animate(
        node.querySelector(".pf-map-signal")!,
        {
          transform: [
            travel(28),
            travel(38),
            travel(distance - 5),
            travel(distance),
            travel(distance),
          ],
          opacity: [0, 1, 1, 0, 0],
        },
        { ...timing, times: [0, 0.045, 0.23, 0.27, 1] },
      ),
    );
    timeline.push(
      animate(
        node.querySelector(".pf-map-echo")!,
        {
          transform: [
            "scale(1)",
            "scale(1)",
            "scale(1.08)",
            "scale(1.35)",
            "scale(1.35)",
          ],
          opacity: [0, 0, 0.75, 0, 0],
        },
        { ...timing, times: [0, 0.22, 0.27, 0.45, 1] },
      ),
    );
  }
  return timeline;
}

export function SkillMap() {
  const figure = useRef<HTMLElement>(null);
  const chart = useRef<SVGSVGElement>(null);
  const controls = useRef<ReturnType<typeof startSignals>>([]);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const pausedRef = useRef(false);
  const syncPlayback = useRef<(() => void) | null>(null);

  useEffect(() => {
    const card = figure.current;
    const svg = chart.current;
    if (!card || !svg) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    function sync() {
      const play =
        visible && !document.hidden && !reduce.matches && !pausedRef.current;
      if (play && !controls.current.length && svg)
        controls.current = startSignals(svg);
      for (const animation of controls.current) {
        if (play) animation.play();
        else animation.pause();
      }
    }
    const stop = inView(
      card,
      () => {
        visible = true;
        sync();
        return () => {
          visible = false;
          sync();
        };
      },
      { amount: 0.15 },
    );
    syncPlayback.current = sync;
    reduce.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      stop();
      syncPlayback.current = null;
      reduce.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      controls.current.forEach((animation) => animation.cancel());
      controls.current = [];
    };
  }, []);

  function togglePlayback() {
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
    syncPlayback.current?.();
  }

  return (
    <figure
      ref={figure}
      className="pf-skill-map"
      id="skills-map"
      aria-label="Skills in practice"
    >
      <div className="pf-map-toolbar">
        <span className="pf-kicker">Skills in practice</span>
        <button
          type="button"
          className="pf-map-playback"
          onClick={togglePlayback}
          aria-label={
            paused ? "Play skills animation" : "Pause skills animation"
          }
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
          <span>{paused ? "Play" : "Pause"}</span>
        </button>
      </div>
      <div className="pf-map-diagram">
        <svg ref={chart} viewBox="0 0 360 284" aria-hidden="true">
          <defs>
            <linearGradient id="pf-signal-tail">
              <stop stopColor="#518566" stopOpacity="0" />
              <stop offset="1" stopColor="#367447" />
            </linearGradient>
          </defs>
          {branches.map(({ x, y, label, tool, glyph: Glyph }, index) => {
            const angle = (Math.atan2(y - hub.y, x - hub.x) * 180) / Math.PI;
            const active = selected === index;
            return (
              <g key={label} className="pf-map-branch" data-active={active}>
                <line
                  x1={hub.x}
                  y1={hub.y}
                  x2={x}
                  y2={y}
                  stroke={active ? "#64856b" : "#b8c7b7"}
                  strokeWidth={active ? 1.6 : 1}
                />
                <g transform={`translate(${hub.x} ${hub.y}) rotate(${angle})`}>
                  <g className="pf-map-signal" opacity="0">
                    <rect
                      x="-16"
                      y="-1.5"
                      width="16"
                      height="3"
                      rx="1.5"
                      fill="url(#pf-signal-tail)"
                    />
                    <circle r="2" fill="#467a51" />
                  </g>
                </g>
                <g transform={`translate(${x} ${y})`}>
                  <circle
                    className="pf-map-echo"
                    r="28"
                    fill="none"
                    stroke="#648c69"
                    strokeWidth="1.6"
                    opacity="0"
                  />
                  <circle
                    className="pf-map-disc"
                    r="28"
                    fill={active ? "#e3ebdc" : "#fcfbf8"}
                    stroke={active ? "#446b50" : "#8ca08e"}
                  />
                  <circle
                    cx="21"
                    cy="-19"
                    r="3"
                    fill="#577560"
                    stroke="#fcfbf8"
                    strokeWidth="1.5"
                  />
                  <Glyph
                    x="-8"
                    y="-18"
                    width="16"
                    height="16"
                    strokeWidth={1.6}
                    stroke="#40634b"
                  />
                  <text
                    textAnchor="middle"
                    y="13"
                    fontSize="12"
                    fontWeight="650"
                    fill="#20261f"
                  >
                    {label}
                  </text>
                  <text
                    textAnchor="middle"
                    y="45"
                    fontSize="12.5"
                    fill="#4d614f"
                    stroke="#f3f4ee"
                    strokeWidth="5"
                    paintOrder="stroke"
                  >
                    {tool}
                  </text>
                </g>
              </g>
            );
          })}
          <circle cx={hub.x} cy={hub.y} r="33" fill="#263b2c" />
          <text
            x="178"
            y="142"
            textAnchor="middle"
            fontSize="32"
            fontWeight="800"
            letterSpacing="-3.2"
            fill="#fcfbf8"
          >
            su
          </text>
        </svg>
        {branches.map(({ x, y, label, tool }, index) => (
          <button
            key={label}
            type="button"
            className="pf-map-hit"
            style={{ left: `${(x / 360) * 100}%`, top: `${(y / 284) * 100}%` }}
            aria-label={`${label}: ${tool}`}
            aria-pressed={selected === index}
            aria-controls="skill-detail"
            onClick={() => setSelected(selected === index ? null : index)}
          />
        ))}
      </div>
      <figcaption id="skill-detail" aria-live="polite" aria-atomic="true">
        {selected === null ? (
          "Select a skill to see how I use it."
        ) : (
          <>
            <strong>{branches[selected].label}.</strong>{" "}
            {branches[selected].detail}
          </>
        )}
      </figcaption>
    </figure>
  );
}
