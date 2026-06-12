import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .md / .mdx files to act as pages and be imported as modules.
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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
  defaultLang: "plaintext",
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins as STRING names (functions can't cross into
    // Rust). remark-frontmatter strips the YAML --- block from the rendered
    // output; the registry still reads that frontmatter separately for metadata.
    remarkPlugins: ["remark-frontmatter"],
    rehypePlugins: [["rehype-pretty-code", prettyCodeOptions]],
  },
});

export default withMDX(nextConfig);
