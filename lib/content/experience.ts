import type { Certification, Role } from "./types";

/**
 * Short framing lines that give each section a distinct job in the storyline,
 * so a scrolling recruiter sees the narrative advance instead of repeat.
 */
export const sectionIntros = {
  projects:
    "The proof. Each of these shipped — here's what they did, not just what they used.",
  experience: "The track record — where I've built and what I owned.",
  certifications:
    "The receipts behind the security claim. Credentials, not adjectives.",
} as const;

/**
 * PLACEHOLDER EXPERIENCE — replace with Selwyn's real roles.
 * Order newest first. Keep highlights outcome-focused.
 */
export const experience: Role[] = [
  {
    company: "Company Name — Replace Me",
    title: "Full Stack Developer",
    period: "2023 — Present",
    highlights: [
      "Led development of a Next.js application serving X users, improving load time by Y%.",
      "Designed and secured the API layer, applying auth best practices and input validation.",
      "Owned the feature lifecycle from architecture through deployment on Vercel.",
    ],
  },
  {
    company: "Previous Company — Replace Me",
    title: "Web Developer",
    period: "2021 — 2023",
    highlights: [
      "Built and shipped responsive React interfaces from design to production.",
      "Collaborated cross-functionally to deliver features on tight timelines.",
    ],
  },
];

/** Skills shown alongside experience. Edit freely. */
export const skills: string[] = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Tailwind CSS",
  "REST APIs",
  "Web Security",
  "Authentication",
  "Vercel",
];

/**
 * Certifications — Selwyn's cybersecurity credentials are a real differentiator.
 * PLACEHOLDER entries below: replace names/issuers/years with your actual certs,
 * and add `url` for any with a public verification link.
 */
export const certifications: Certification[] = [
  {
    name: "Certification Name — Replace Me",
    issuer: "Issuing Organization",
    year: "2024",
  },
  {
    name: "Security Certification — Replace Me",
    issuer: "Issuing Organization",
    year: "2023",
  },
  {
    name: "Another Credential — Replace Me",
    issuer: "Issuing Organization",
    year: "2023",
  },
];
