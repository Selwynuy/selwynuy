import type { MetadataRoute } from "next";

// TODO: update to the production URL once deployed.
const siteUrl = "https://selwynuy.dev";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
