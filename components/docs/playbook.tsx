import { buildPlaybook } from "@/lib/docs/registry";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/lib/content/profile";
import { CopyPlaybook } from "./copy-playbook";

/**
 * Server wrapper: assembles the full playbook prompt at build time from the
 * registry (single source) and hands it to the client copy button. Keeps the
 * registry server-only.
 */
export function Playbook() {
  const playbook = buildPlaybook({
    siteUrl: SITE_URL,
    authorName: profile.name,
  });
  const wordCount = playbook.split(/\s+/).filter(Boolean).length;

  return (
    <CopyPlaybook
      playbook={playbook}
      fullUrl={`${SITE_URL}/llms-full.txt`}
      wordCount={wordCount}
    />
  );
}
