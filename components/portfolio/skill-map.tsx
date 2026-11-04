"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const tools = [
  {
    label: "Web", stack: "Next.js & React", left: 19, top: 43,
    title: "Inside a timed mock exam",
    story: "On CSE Exam Review, you can skip a question, flag it, and come back before the timer runs out. I built that flow for people practicing under exam conditions.",
    href: "/notes/inside-cse-exam-review", link: "Read the product note",
  },
  {
    label: "iOS", stack: "Swift & PhotoKit", left: 53, top: 43,
    title: "The final say on every photo",
    story: "In Choopi, a swipe marks a photo for review. I built a final confirmation step in the iOS app so you can change your mind before anything leaves your camera roll.",
    href: "https://choopi.genetrify.com", link: "Explore Choopi",
  },
  {
    label: "Data", stack: "PostgreSQL & Supabase", left: 83, top: 43,
    title: "A trail for every reported question",
    story: "When an examinee spots a wrong answer key, CSE Exam Review saves their report against the question. I can find the exact item, review it, and record what happened.",
    href: "https://cseexamreview.com", link: "Visit CSE Exam Review",
  },
  {
    label: "AI tools", stack: "Claude Code & Codex", left: 17, top: 86,
    title: "The questions before the code",
    story: "I use AI to explore and review implementations. I also wrote a Claude Code skill that turns a project conversation into a brief and flags decisions I still need to make.",
    href: "/skills/discovery-to-prd", link: "See the skill I wrote",
  },
  {
    label: "Delivery", stack: "GitHub Actions & VPS", left: 50, top: 86,
    title: "What happens after I push",
    story: "I run deployments on Hostinger VPS and use GitHub Actions to check my work. For this portfolio, every push to main gets type checks, tests, and a production build.",
    href: "https://github.com/Selwynuy/selwynuy/blob/main/.github/workflows/ci.yml", link: "View this site’s workflow",
  },
  {
    label: "Security", stack: "Web & API testing", left: 83, top: 86,
    title: "Checking who can reach what",
    story: "At Black Bear Securities, I tested web apps and APIs, reproduced findings, and checked the fixes. I bring that same habit to access decisions in my own products.",
    href: "/notes/from-cybersecurity-to-product-building", link: "Read my security story",
  },
];

export function SkillMap() {
  const [selected, setSelected] = useState(0);
  const tool = tools[selected];

  return (
    <section id="skills-map" className="pf-bench" aria-labelledby="bench-title">
      <header className="pf-bench-intro">
        <span className="pf-kicker">Inside Genetrify</span>
        <h2 id="bench-title">On my workbench.</h2>
        <p>Pick a tool to see where I’ve put it to work.</p>
      </header>
      <div className="pf-bench-plate" role="group" aria-label="Choose a skill">
        <Image
          src="/portfolio/workbench.webp" alt="" width={1440} height={960}
          sizes="(min-width: 800px) 55vw, 95vw"
        />
        {tools.map((item, index) => (
          <button
            key={item.label}
            type="button"
            className="pf-bench-tool"
            style={{ left: `${item.left}%`, top: `${item.top}%` }}
            aria-label={item.label + ", " + item.stack}
            aria-pressed={index === selected}
            aria-controls="skill-detail"
            onClick={() => setSelected(index)}
          >
            <span className="pf-bench-tag">
              <span className="pf-bench-number" aria-hidden="true">0{index + 1}</span>
              {item.label}
            </span>
          </button>
        ))}
      </div>
      <div id="skill-detail" className="pf-bench-note" aria-live="polite" aria-atomic="true">
        <div key={tool.label} className="pf-bench-entry">
          <p className="pf-bench-index"><span>0{selected + 1} / 06</span> {tool.stack}</p>
          <h3>{tool.title}</h3>
          <p className="pf-bench-story">{tool.story}</p>
          <a className="pf-text-link" href={tool.href}>
            {tool.link}<ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
