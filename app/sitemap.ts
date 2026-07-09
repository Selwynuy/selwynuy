import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllDocs } from "@/lib/docs/registry";
import { SKILLS } from "@/lib/docs/skills";
import { GUIDES } from "@/lib/docs/guides";

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = getAllDocs();

  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    {
      url: `${SITE_URL}/docs`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...docs.map((doc) => ({
      url: `${SITE_URL}/docs/${doc.slug}`,
      lastModified: doc.updated ? new Date(doc.updated) : undefined,
      changeFrequency: "monthly" as const,
      priority: doc.verified ? 0.8 : 0.5,
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
