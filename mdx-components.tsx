import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Global MDX component map. REQUIRED by @next/mdx in the App Router.
 *
 * Maps markdown-generated HTML to brand-styled elements so handbook prose
 * reads as "designed", not raw `prose`. Heading ids are added by rehype-slug
 * at compile time (single source of truth, shared algorithm with the TOC), so
 * these components only style the headings, they do not set ids.
 */

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="display mt-2 mb-6 text-3xl text-foreground sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ id, children }) => (
      <h2
        id={id}
        className="display mt-12 mb-4 scroll-mt-24 text-2xl text-foreground"
      >
        {children}
      </h2>
    ),
    h3: ({ id, children }) => (
      <h3
        id={id}
        className="mt-8 mb-3 scroll-mt-24 text-lg font-semibold text-foreground"
      >
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="my-4 leading-relaxed text-muted">{children}</p>
    ),
    a: ({ href = "", children }) => {
      const external = /^https?:\/\//.test(href);
      const cls =
        "text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent";
      return external ? (
        <a href={href} target="_blank" rel="noreferrer noopener" className={cls}>
          {children}
        </a>
      ) : (
        <Link href={href} className={cls}>
          {children}
        </Link>
      );
    },
    ul: ({ children }) => (
      <ul className="my-4 ml-5 list-disc space-y-2 text-muted marker:text-accent">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="my-4 ml-5 list-decimal space-y-2 text-muted marker:text-subtle">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-accent bg-surface px-5 py-3 text-foreground/90 [&>p]:my-1">
        {children}
      </blockquote>
    ),
    // Inline code. Fenced blocks are handled by the Shiki pipeline (rehype).
    code: ({ children, className }) => {
      if (className) return <code className={className}>{children}</code>;
      return (
        <code className="rounded bg-surface-raised px-1.5 py-0.5 font-mono text-[0.85em] text-accent ring-1 ring-hairline">
          {children}
        </code>
      );
    },
    hr: () => <hr className="my-10 border-hairline" />,
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto">
        <table className="w-full border-collapse text-sm">{children}</table>
      </div>
    ),
    th: ({ children }) => (
      <th className="border-b border-hairline px-3 py-2 text-left font-semibold text-foreground">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="border-b border-hairline px-3 py-2 text-muted">{children}</td>
    ),
    ...components,
  };
}
