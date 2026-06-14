import { buildClaudeMd } from "@/lib/docs/registry";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/lib/content/profile";

/**
 * /claude.md, the whole handbook distilled into a ready-to-save CLAUDE.md of
 * actionable rules. The "Copy for AI" bootstrap tells a coding agent to fetch
 * this and write it into the user's project root, so future sessions inherit
 * the rules. Served as markdown, generated from the registry (single source).
 */
export const dynamic = "force-static";

export function GET() {
  const body = buildClaudeMd({
    siteUrl: SITE_URL,
    authorName: profile.name,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
