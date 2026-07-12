"use client";

import { useEffect } from "react";

/**
 * Forces the dark theme on the WHOLE document (site header included) while
 * mounted, so an art-directed dark page never sits under a light header.
 * On unmount the visitor's real preference is restored: their explicit
 * choice from localStorage if one exists (matching theme-toggle.tsx),
 * otherwise the data-theme attribute is removed and the OS preference
 * takes over again.
 */
export function ForceDarkTheme() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.theme = "dark";
    return () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("theme");
      } catch {
        // ignore storage failures (private mode etc.)
      }
      if (stored === "dark" || stored === "light") {
        html.dataset.theme = stored;
      } else {
        delete html.dataset.theme;
      }
    };
  }, []);

  return null;
}
