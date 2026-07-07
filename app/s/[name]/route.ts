import { getSkill, getSkillNames } from "@/lib/docs/skills";
import { buildSkillMd } from "@/lib/docs/registry";
import { SITE_URL } from "@/lib/site";

/**
 * ONE-DROP skill endpoint. Serves a skill's SKILL.md as plain markdown so a user
 * (or agent) can read exactly what the installed skill contains.
 *
 *   GET /s/<name>.md  ->  text/markdown
 *
 * This is the browsable twin of the installable bundle: the same generator
 * (buildSkillMd) produces both, so the page and the installed skill can't drift.
 * Install itself is git-based (`/plugin marketplace add`), not this URL.
 * Name is validated against the catalog; unknown names 404. Prerendered.
 */

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  // The segment includes ".md" so the URL reads /s/discovery-to-prd.md.
  return getSkillNames().map((name) => ({ name: `${name}.md` }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name: param } = await params;
  const name = param.replace(/\.md$/, "");
  const skill = getSkill(name);

  if (!skill) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const md = buildSkillMd(skill, { siteUrl: SITE_URL });
  return new Response(md + "\n", {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
