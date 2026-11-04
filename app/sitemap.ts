import type { MetadataRoute } from "next";
import { notes } from "@/lib/content/notes";
import { SITE_URL } from "@/lib/site";
import { SKILLS } from "@/lib/docs/skills";
import { GUIDES } from "@/lib/docs/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/links`, changeFrequency: "monthly", priority: 0.8 },
    ...notes.map((note) => ({
      url: `${SITE_URL}/notes/${note.slug}`,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/skills`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...SKILLS.map((skill) => ({
      url: `${SITE_URL}/skills/${skill.name}`,
      changeFrequency: "monthly" as const,
      priority: skill.verified ? 0.7 : 0.4,
    })),
    {
      url: `${SITE_URL}/guides`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...GUIDES.map((guide) => ({
      url: `${SITE_URL}/guides/${guide.slug}`,
      changeFrequency: "monthly" as const,
      priority: guide.verified ? 0.6 : 0.4,
    })),
  ];
}
