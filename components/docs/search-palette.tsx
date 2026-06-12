"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export interface SearchDoc {
  slug: string;
  title: string;
  summary: string;
  section: string;
}

/**
 * Cmd/Ctrl+K command palette for the handbook. Searches doc titles and
 * summaries from a static index passed at build time. No external index step,
 * no extra bundle: at this scale (a couple dozen pages) substring matching over
 * the registry is instant and sufficient. Terminal-styled to fit the brand.
 */
export function SearchPalette({ docs }: { docs: SearchDoc[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Global Cmd/Ctrl+K to open, "/" to open when not typing elsewhere.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const k = e.key.toLowerCase();
      if ((e.metaKey || e.ctrlKey) && k === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (
        k === "/" &&
        !open &&
        !/input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")
      ) {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      const id = setTimeout(() => inputRef.current?.focus(), 0);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setQuery("");
      setActive(0);
    }, 0);
    return () => clearTimeout(id);
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return docs;
    return docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        d.summary.toLowerCase().includes(q) ||
        d.section.toLowerCase().includes(q),
    );
  }, [query, docs]);

  function go(slug: string) {
    setOpen(false);
    router.push(`/docs/${slug}`);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-1.5 font-mono text-xs text-muted ring-1 ring-hairline transition-colors hover:text-foreground"
        aria-label="Search the handbook"
      >
        <span>Search</span>
        <kbd className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[10px]">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/70 px-4 pt-[15vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search the handbook"
            className="w-full max-w-lg overflow-hidden rounded-xl bg-surface-raised shadow-soft-lg ring-1 ring-hairline"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 border-b border-hairline px-4">
              <span className="font-mono text-accent" aria-hidden>
                ▸
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((a) => Math.min(a + 1, results.length - 1));
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((a) => Math.max(a - 1, 0));
                  } else if (e.key === "Enter" && results[active]) {
                    go(results[active].slug);
                  }
                }}
                placeholder="Search the handbook"
                className="w-full bg-transparent py-3.5 font-mono text-sm text-foreground outline-none placeholder:text-subtle"
              />
            </div>
            <ul className="max-h-72 overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-subtle">
                  No matches
                </li>
              )}
              {results.map((d, i) => (
                <li key={d.slug}>
                  <button
                    type="button"
                    onClick={() => go(d.slug)}
                    onMouseEnter={() => setActive(i)}
                    className={`flex w-full flex-col items-start rounded-lg px-3 py-2 text-left transition-colors ${
                      i === active ? "bg-foreground/[0.06]" : ""
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="font-medium text-foreground">
                        {d.title}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-subtle">
                        {d.section}
                      </span>
                    </span>
                    <span className="mt-0.5 line-clamp-1 text-xs text-muted">
                      {d.summary}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
