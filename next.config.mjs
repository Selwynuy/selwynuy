import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .md / .mdx files to act as pages and be imported as modules.
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    // Turbopack requires plugins as STRING names (functions can't cross into
    // Rust). remark-frontmatter strips the YAML --- block from the rendered
    // output; the registry still reads that frontmatter separately for metadata.
    remarkPlugins: ["remark-frontmatter"],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
