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
 * Experience, newest first. Roles and dates mirror the resume/LinkedIn; the
 * highlights are rewritten to lead with the outcome, not the task.
 */
export const experience: Role[] = [
  {
    company: "cseexamreview.com (Self-employed)",
    title: "Founder and Full Stack Developer",
    period: "2026, Present",
    highlights: [
      "Founded and shipped cseexamreview.com end to end on Next.js, a Civil Service Exam prep platform built from database design through production deployment.",
      "Owned the auth and data layer with a security-first posture: validated inputs, least-privilege access, and secrets kept off the client.",
      "Run the full lifecycle solo, architecture, build, and release, shipping continuously.",
    ],
  },
  {
    company: "Forthwith Industry LLC",
    title: "Web Developer",
    period: "2026, Present",
    highlights: [
      "Build and ship production Next.js applications (App Router, Server Components) in TypeScript for a US-based team, remote.",
      "Implement authentication, middleware, and server actions with least-privilege access across administrative routes.",
      "Apply Security-by-Design defaults, strict input validation, CSP, and secure HTTP headers, to harden against OWASP Top 10 risks.",
    ],
  },
  {
    company: "Black Bear Securities",
    title: "Cybersecurity Intern (VAPT)",
    period: "2026",
    highlights: [
      "Ran vulnerability assessments across web applications and APIs using OWASP methodologies, identifying and reporting high-severity findings.",
      "Validated exploitability with manual and automated testing and wrote proof-of-concept exploits to help engineering prioritize remediation.",
      "Delivered technical reports and executive summaries, then verified that hardening controls (auth hardening, input validation, CSP) were correctly implemented.",
    ],
  },
];

/** Skills shown in the marquee. Dev stack first, then the security edge. */
export const skills: string[] = [
  "Next.js",
  "React",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "Tailwind CSS",
  "Auth.js",
  "Zod",
  "Vercel",
  "Web Security",
  "OWASP Top 10",
  "Penetration Testing",
  "Burp Suite",
  "Threat Hunting",
];

/**
 * Certifications, the receipts behind the security claim. The curated set
 * (`featured: true`) stays visible; the rest live behind a "show all" toggle so
 * the section stays scannable. Credential IDs and verify links are sourced from
 * LinkedIn; images are the actual certificates in /public/certs.
 */
export const certifications: Certification[] = [
  // --- Curated, always visible ---
  {
    name: "Certified Associate Penetration Tester (CAPT)",
    issuer: "Hackviser",
    year: "2026",
    credentialId: "HV-CAPT-54X6OLSD",
    featured: true,
  },
  {
    name: "Certified Junior Web Penetration Tester (CJWPT)",
    issuer: "Hack & Fix",
    year: "2026",
    credentialId: "4152-4848-3417-3533",
    featured: true,
  },
  {
    name: "Blue Team Junior Analyst (BTJA)",
    issuer: "Security Blue Team",
    year: "2026",
    credentialId: "839343794",
    image: "/certs/btja.jpg",
    featured: true,
  },
  {
    name: "Certified Phishing Prevention Specialist (CPPS)",
    issuer: "Hack & Fix",
    year: "2025",
    credentialId: "6272-6231-6194-5612",
    featured: true,
  },
  {
    name: "Introduction to Bug Bounty",
    issuer: "Red Team Leaders",
    year: "2025",
    credentialId: "a8bf7657dede93c2",
    featured: true,
  },
  {
    name: "Cybersecurity Career Starter Certification (CCSC)",
    issuer: "Hack & Fix",
    year: "2025",
    credentialId: "2912-3000-4058-3482",
    featured: true,
  },
  {
    name: "Build a Secure Google Cloud Network",
    issuer: "Google Cloud",
    year: "2025",
    featured: true,
  },
  {
    name: "Cybersecurity Essentials (LFC108)",
    issuer: "The Linux Foundation",
    year: "2025",
    featured: true,
  },

  // --- Security Blue Team pathway (Blue Team) ---
  {
    name: "Introduction to Vulnerability Management",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/vuln-management.jpg",
  },
  {
    name: "Introduction to Threat Hunting",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/threat-hunting.jpg",
  },
  {
    name: "Introduction to OSINT",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/osint.jpg",
  },
  {
    name: "Introduction to Digital Forensics",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/digital-forensics.jpg",
  },
  {
    name: "Introduction to Network Analysis",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/network-analysis.jpg",
  },
  {
    name: "Introduction to Dark Web Operations",
    issuer: "Security Blue Team",
    year: "2026",
    image: "/certs/dark-web-ops.jpg",
  },

  // --- Cloud, training, and foundations ---
  {
    name: "Implement CI/CD Pipelines on Google Cloud",
    issuer: "Google Cloud",
    year: "2025",
  },
  {
    name: "Digital Transformation with Google Cloud",
    issuer: "Google Cloud",
    year: "2025",
  },
  {
    name: "Advanced Threat Defense 201",
    issuer: "Trend Micro",
    year: "2025",
  },
  {
    name: "Advent of Cyber 2025",
    issuer: "TryHackMe",
    year: "2025",
    credentialId: "THM-A90OIBU7PD",
  },
  {
    name: "Trend Micro uCTF 2024",
    issuer: "Trend Micro",
    year: "2024",
    image: "/certs/ductf.png",
  },
  {
    name: "Introduction to Internet of Things",
    issuer: "Cisco",
    year: "2025",
  },
];
