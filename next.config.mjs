import createMDX from "@next/mdx";

/**
 * Baseline security headers. A security-branded site should practice what it
 * preaches: clickjacking protection, MIME sniffing off, a tight referrer
 * policy, and locked-down powerful features. CSP is documented in the handbook
 * and left to a per-deployment decision (it needs nonces + dynamic rendering).
 */
const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .md / .mdx files to act as pages and be imported as modules.
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

/**
 * Shiki options for rehype-pretty-code. Must be serializable (Turbopack passes
 * these to Rust). A near-black theme keeps code legible; brand red is applied
 * to the block chrome (header bar, copy button, line highlight) via CSS, not by
 * recoloring tokens.
 */
const prettyCodeOptions = {
  theme: "vesper",
  keepBackground: false,
  // Only fenced blocks get a default language; inline code is left alone so it
  // keeps the tight inline-pill styling instead of becoming a full-width figure.
  defaultLang: { block: "plaintext" },
  bypassInlineCode: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins as STRING names (functions can't cross into
    // Rust). remark-frontmatter strips the YAML --- block from the rendered
    // output; the registry still reads that frontmatter separately for metadata.
    remarkPlugins: ["remark-frontmatter"],
    // rehype-slug adds ids to headings using the same github-slugger algorithm
    // the TOC mirrors, so right-rail anchors line up. Runs before pretty-code.
    rehypePlugins: [
      "rehype-slug",
      ["rehype-pretty-code", prettyCodeOptions],
    ],
  },
});

export default withMDX(nextConfig);
