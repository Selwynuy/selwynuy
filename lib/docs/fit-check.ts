/**
 * Pure logic for the project creator: the Next.js fit-check verdict and the
 * tailored-section selection. Extracted from the wizard UI so it can be unit
 * tested. Mirrors the 6-step checklist on the "Is Next.js the Right Tool?" page.
 */

export type CenterOfGravity =
  | "web"
  | "sockets"
  | "mobile"
  | "compute"
  | "static"
  | "tiny";

export type Scale = "personal" | "growing" | "serious";

export interface Answers {
  building: string;
  centerOfGravity: CenterOfGravity;
  needs: string[];
  scale: Scale;
}

export interface Verdict {
  tone: "great" | "wrong";
  headline: string;
  body: string;
  reach?: string;
}

/** Map a "needs" value to the playbook slugs that cover it. */
export const NEED_SLUGS: Record<string, string[]> = {
  database: ["supabase-setup", "database-scalability"],
  auth: ["supabase-setup", "security-by-design"],
  payments: ["security-by-design"],
  email: ["email-with-resend", "email-templates"],
  seo: ["seo"],
  realtimeLight: [],
};

/** The fit verdict. First non-web center of gravity wins (the checklist). */
export function fitVerdict(a: Answers): Verdict {
  switch (a.centerOfGravity) {
    case "sockets":
      return {
        tone: "wrong",
        headline: "Next.js is the wrong center for this",
        body: "Many concurrent, long-lived sockets are not a request/response job, and serverless will bill you for connections that never close.",
        reach:
          "Reach for Phoenix (Elixir) or a small Go socket service, or a managed layer like Ably/Pusher. Keep Next.js as the app beside it.",
      };
    case "mobile":
      return {
        tone: "wrong",
        headline: "A web framework is the wrong center for a native app",
        body: "If it lives on a phone with device features and an app store presence, a PWA hits a wall on the native capabilities that justify the app.",
        reach:
          "Reach for React Native with Expo, or fully native. Next.js becomes the marketing site and shared API.",
      };
    case "compute":
      return {
        tone: "wrong",
        headline: "Long compute does not belong in a request handler",
        body: "Serverless has time limits and cold starts, and the ML tooling does not live in Node.",
        reach:
          "Reach for a Python service (FastAPI) plus a queue and workers. Next.js takes the upload, enqueues, and shows status.",
      };
    case "static":
      return {
        tone: "wrong",
        headline: "This is more machine than the job needs",
        body: "Pure prose with no authenticated surface and no per-request logic does not need a full React framework.",
        reach:
          "Reach for Astro: mostly-zero-JS HTML, content collections first-class. Move to Next.js when it grows a login.",
      };
    case "tiny":
      return {
        tone: "wrong",
        headline: "A whole app is overhead for a few endpoints",
        body: "One webhook or a tiny JSON API does not need an app/ tree and a client runtime.",
        reach:
          "Reach for a single serverless function or a tiny Hono app. It becomes Next.js only if it grows a UI.",
      };
    default:
      return {
        tone: "great",
        headline: "Next.js is the right call",
        body: "The deliverable is HTML in a browser plus server logic, which is exactly where Next.js earns its place.",
      };
  }
}

/** Ordered, deduped playbook slugs for a web-app verdict, tailored to answers. */
export function relevantSlugs(a: Answers): string[] {
  const base = [
    "getting-started",
    "project-setup",
    "system-architecture",
    "security-by-design",
  ];
  const fromNeeds = a.needs.flatMap((n) => NEED_SLUGS[n] ?? []);
  const ship = ["error-handling-ux", "deployment"];
  const atScale =
    a.scale === "serious"
      ? ["database-scalability", "ci-cd-pipelines", "sentry-setup"]
      : [];
  return [...new Set([...base, ...fromNeeds, ...ship, ...atScale])];
}
