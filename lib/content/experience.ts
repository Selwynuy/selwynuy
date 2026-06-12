import type { Certification, Role } from "./types";

/**
 * Short framing lines that give each section a distinct job in the storyline,
 * so a scrolling recruiter sees the narrative advance instead of repeat.
 */
export const sectionIntros = {
  projects:
    "The proof. Each of these shipped, here's what they did, not just what they used.",
  experience: "The track record, where I've built and what I owned.",
  certifications:
    "The receipts behind the security claim. Credentials, not adjectives.",
} as const;

/**
 * Experience. The cseexamreview.com founder role is real. Add your other roles
 * (newest first) and tune the highlights to be outcome-focused, then remove the
 * allow-list entry for this file in scripts/check-content.mjs.
 */
export const experience: Role[] = [
  {
    company: "CSE Exam Review",
    title: "Founder and Full Stack Developer",
    period: "Present",
    highlights: [
      "Founded and built cseexamreview.com end to end on Next.js, from database design to production deployment.",
      "Designed the auth and data layer with a security-first posture: validated inputs, least-privilege access, and secrets kept off the client.",
      "Owned the full lifecycle, architecture through deployment, shipping continuously.",
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
 * Certifications. Selwyn's cybersecurity credentials are a real differentiator.
 * Add your actual certs here (name, issuer, year, and a `url` for any with a
 * public verification link). Empty for now: the section renders an honest
 * "being added" state rather than invented credentials.
 */
export const certifications: Certification[] = [];
