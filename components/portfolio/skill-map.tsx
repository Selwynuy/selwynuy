"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

const tools = [
  {
    label: "Web", stack: "Next.js & React",
    source: "CSE Exam Review · Timed mock exam",
    image: { src: "/portfolio/examples/cse-runner.webp", alt: "A mock exam with a countdown, flagged questions, and a question navigator." },
    title: "Inside a timed mock exam",
    story: "On CSE Exam Review, you can skip a question, flag it, and come back before the timer runs out. I built that flow for people practicing under exam conditions.",
    href: "/notes/inside-cse-exam-review", link: "Read the product note",
  },
  {
    label: "iOS", stack: "Swift & PhotoKit",
    source: "Choopi · iOS session summary",
    image: { src: "/portfolio/examples/choopi-summary.webp", alt: "Choopi’s iOS summary showing how many photos were kept and cleared." },
    title: "The final say on every photo",
    story: "In Choopi, a swipe marks a photo for review. I built a final confirmation step in the iOS app so you can change your mind before anything leaves your camera roll.",
    href: "https://choopi.genetrify.com", link: "Explore Choopi",
  },
  {
    label: "Data", stack: "PostgreSQL & Supabase",
    source: "CSE Exam Review · Question reports",
    fields: [
      ["question_id", "The question being reported"],
      ["reason", "What the examinee spotted"],
      ["status", "Open, resolved, or dismissed"],
    ],
    title: "A trail for every reported question",
    story: "When an examinee spots a wrong answer key, CSE Exam Review saves their report against the question. I can find the exact item, review it, and record what happened.",
    href: "https://cseexamreview.com", link: "Visit CSE Exam Review",
  },
  {
    label: "AI tools", stack: "Claude Code & Codex",
    source: "Discovery to PRD · My Claude Code skill",
    fields: [
      ["01", "Validate the idea"],
      ["02", "Clarify the requirements"],
      ["03", "Write and agree on the brief"],
      ["04", "Start the build"],
    ],
    title: "The questions before the code",
    story: "I use AI to explore and review implementations. I also wrote a Claude Code skill that turns a project conversation into a brief and flags decisions I still need to make.",
    href: "/skills/discovery-to-prd", link: "See the skill I wrote",
  },
  {
    label: "Delivery", stack: "GitHub Actions & VPS",
    source: "This portfolio · GitHub Actions",
    fields: [
      ["01", "Typecheck and lint"],
      ["02", "Check the site content"],
      ["03", "Run unit tests"],
      ["04", "Build for production"],
    ],
    title: "What happens after I push",
    story: "I run deployments on Hostinger VPS and use GitHub Actions to check my work. For this portfolio, every push to main gets type checks, tests, and a production build.",
    href: "https://github.com/Selwynuy/selwynuy/blob/main/.github/workflows/ci.yml", link: "View this site’s workflow",
  },
  {
    label: "Security", stack: "Web & API testing",
    source: "Hackviser · Security credential",
    image: { src: "/certs/capt.jpg", alt: "Selwyn Uy’s Certified Associate Penetration Tester credential from Hackviser." },
    title: "Checking who can reach what",
    story: "At Black Bear Securities, I tested web apps and APIs, reproduced findings, and checked the fixes. I bring that same habit to access decisions in my own products.",
    href: "/notes/from-cybersecurity-to-product-building", link: "Read my security story",
  },
];

export function SkillMap() {
  const [selected, setSelected] = useState(0);
  const tool = tools[selected];

  return (
    <section id="skills-map" className="pf-practice" aria-labelledby="practice-title">
      <header className="pf-section-head">
        <h2 id="practice-title">Skills in practice.</h2>
      </header>
      <div className="pf-practice-switch" role="group" aria-label="Choose a skill">
        {tools.map((item, index) => (
          <button
            key={item.label}
            type="button"
            aria-pressed={index === selected}
            aria-controls="skill-detail"
            onClick={() => setSelected(index)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div id="skill-detail" aria-live="polite" aria-atomic="true">
        <article key={tool.label} className="pf-practice-case">
          <div className="pf-practice-copy">
            <p className="pf-kicker">{tool.stack}</p>
            <h3>{tool.title}</h3>
            <p>{tool.story}</p>
            <a className="pf-text-link" href={tool.href}>
              {tool.link}<ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>
          <figure className="pf-practice-example">
            {tool.image ? (
              <div className="pf-practice-screen">
                <Image src={tool.image.src} alt={tool.image.alt} fill
                  sizes="(max-width: 720px) 92vw, 52vw" />
              </div>
            ) : (
              <dl className="pf-practice-records">
                {tool.fields.map(([key, value]) => (
                  <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            )}
            <figcaption>{tool.source}</figcaption>
          </figure>
        </article>
      </div>
    </section>
  );
}
