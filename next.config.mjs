import createMDX from "@next/mdx";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow .md / .mdx files to act as pages and be imported as modules.
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  // remark/rehype plugins are wired in the MDX content layer, not here, so the
  // config stays serializable for Turbopack. See components/docs/mdx pipeline.
});

export default withMDX(nextConfig);
