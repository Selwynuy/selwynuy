"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

/**
 * Theme toggle. The site is dark-first and respects prefers-color-scheme, but a
 * visitor can override and we persist the choice. An inline script in the
 * document head (see layout) applies the stored theme before paint to avoid a
 * flash, so this control only needs to reflect and update state.
 */
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const stored = document.documentElement.dataset.theme as Theme | undefined;
    const initial: Theme =
      stored ??
      (window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark");
    // Defer off the effect body to satisfy the React Compiler lint rule.
    const id = setTimeout(() => setTheme(initial), 0);
    return () => clearTimeout(id);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failures (private mode etc.)
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className="hidden rounded-full p-2 text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground sm:inline-flex"
    >
      {/* Sun when dark (click to go light), moon when light. */}
      {theme === "light" ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
