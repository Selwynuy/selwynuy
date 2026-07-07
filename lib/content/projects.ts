import type { Project } from "./types";

/**
 * Selected work: two shipped products, both founder-owned and live. Live URLs
 * were checked before listing.
 */
export const projects: Project[] = [
  {
    slug: "cse-exam-review",
    name: "CSE Exam Review",
    description:
      "A platform I founded to help people prepare for the Civil Service Exam. Built and shipped end to end on Next.js, from the database to deployment, with authentication and content delivery handled securely.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind", "Auth"],
    liveUrl: "https://cseexamreview.com",
    featured: true,
  },
  {
    slug: "reserve-polomolok",
    name: "ReservePolomolok",
    description:
      "A local booking platform for Polomolok, South Cotabato: real-time availability, deposit-based reservations to cut no-shows, and a unified calendar so business owners manage online and walk-in bookings from one place. Live for sports court rentals, with venues, resorts, and salons launching next.",
    tech: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    liveUrl: "https://reservepolomolok.com",
    featured: true,
  },
];
