import { getDocsBySection } from "@/lib/docs/registry";
import {
  SKILLS,
  SKILLS_PLUGIN,
  SKILLS_MARKETPLACE,
  SKILLS_MARKETPLACE_NAME,
} from "@/lib/docs/skills";
import { abs } from "@/lib/site";
import { profile } from "@/lib/content/profile";

/**
 * /llms.txt, the AI-agent index for the handbook, per the llmstxt.org spec:
 *   H1 (site name) -> blockquote summary -> H2 link sections -> Optional.
 * Each link points at the /d/<slug>.md one-drop endpoint. Generated from the
 * registry so it can never drift from the actual content.
 */
export const dynamic = "force-static";

export function GET() {
  const groups = getDocsBySection();

  const lines: string[] = [
    `# ${profile.name}: Next.js Handbook`,
    "",
    `> An opinionated, fact-checked field guide to building production Next.js applications: project setup, security by default, integrations, growth, and shipping. Each section below is plain markdown you can hand directly to an AI to apply to your own project.`,
    "",
    `Author: ${profile.name} (${profile.role}). Site: ${abs("/")}. Each link is the raw markdown for one section.`,
    "",
  ];

  // Verified sections first, by their handbook sections.
  for (const group of groups) {
    const verified = group.docs.filter((d) => d.verified);
    if (verified.length === 0) continue;
    lines.push(`## ${group.section}`, "");
    for (const doc of verified) {
      lines.push(`- [${doc.title}](${abs(`/d/${doc.slug}.md`)}): ${doc.summary}`);
    }
    lines.push("");
  }

  // Skills: the process packaged as installable Claude Code skills. Each links
  // to its one-drop SKILL.md; install is git-based via the marketplace repo.
  if (SKILLS.length > 0) {
    lines.push("## Skills", "");
    lines.push(
      `> Installable Claude Code skills. Install: \`/plugin marketplace add ${SKILLS_MARKETPLACE}\` then \`/plugin install ${SKILLS_PLUGIN}@${SKILLS_MARKETPLACE_NAME}\`, then run \`/${SKILLS_PLUGIN}:<name>\`.`,
      "",
    );
    for (const skill of SKILLS) {
      const tag = skill.verified ? "" : " (draft)";
      lines.push(
        `- [${skill.title}${tag}](${abs(`/s/${skill.name}.md`)}): ${skill.blurb}`,
      );
    }
    lines.push("");
  }

  // Drafts go under Optional (skippable for a shorter context), per the spec.
  const drafts = groups.flatMap((g) => g.docs.filter((d) => !d.verified));
  if (drafts.length > 0) {
    lines.push("## Optional", "");
    for (const doc of drafts) {
      lines.push(
        `- [${doc.title} (draft)](${abs(`/d/${doc.slug}.md`)}): ${doc.summary}`,
      );
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
