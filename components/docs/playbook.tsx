import {
  buildPlaybook,
  buildBootstrapPrompt,
} from "@/lib/docs/registry";
import { SITE_URL } from "@/lib/site";
import { profile } from "@/lib/content/profile";
import { CopyPlaybook } from "./copy-playbook";

/**
 * Server wrapper: builds the CLAUDE.md bootstrap instruction (the primary
 * one-drop) and the full inline playbook (the offline fallback) at build time
 * from the registry, and hands both to the client copy button. Keeps the
 * registry server-only.
 */
export function Playbook() {
  const bootstrap = buildBootstrapPrompt({ siteUrl: SITE_URL });
  const playbook = buildPlaybook({
    siteUrl: SITE_URL,
    authorName: profile.name,
  });
  const wordCount = playbook.split(/\s+/).filter(Boolean).length;

  return (
    <CopyPlaybook
      bootstrap={bootstrap}
      playbook={playbook}
      claudeMdUrl={`${SITE_URL}/claude.md`}
      fullUrl={`${SITE_URL}/llms-full.txt`}
      wordCount={wordCount}
    />
  );
}
