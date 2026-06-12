"use client";

import { useEffect } from "react";

/**
 * Enhances Shiki code blocks with an always-visible copy button.
 * rehype-pretty-code renders the syntax server-side (zero runtime JS for
 * highlighting); this only adds the copy affordance, mounted once per docs page.
 */
export function CodeCopyEnhancer() {
  useEffect(() => {
    const figures = document.querySelectorAll<HTMLElement>(
      "[data-rehype-pretty-code-figure]",
    );

    const cleanups: Array<() => void> = [];

    figures.forEach((figure) => {
      if (figure.querySelector(".code-copy")) return; // already enhanced
      const pre = figure.querySelector("pre");
      if (!pre) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy";
      btn.setAttribute("aria-label", "Copy code");
      btn.textContent = "Copy";

      const onClick = async () => {
        const code = pre.querySelector("code")?.textContent ?? "";
        try {
          await navigator.clipboard.writeText(code);
          btn.textContent = "Copied";
          btn.dataset.copied = "true";
          window.setTimeout(() => {
            btn.textContent = "Copy";
            btn.dataset.copied = "false";
          }, 2000);
        } catch {
          // Clipboard unavailable: select the text as a fallback.
          const range = document.createRange();
          range.selectNodeContents(pre);
          window.getSelection()?.removeAllRanges();
          window.getSelection()?.addRange(range);
        }
      };

      btn.addEventListener("click", onClick);
      // Append to figure for positioning; the figure is position:relative.
      // pre stays scrollable underneath without clipping the button.
      figure.appendChild(btn);
      cleanups.push(() => btn.removeEventListener("click", onClick));
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
