"use client";

import { useEffect, useState } from "react";

interface Line {
  prompt?: boolean;
  text: string;
  className?: string;
}

/**
 * Terminal identity card whose lines reveal sequentially on mount,
 * with a typed cursor on the active line. Reduced-motion shows all at once.
 */
export function TypingTerminal({
  lines,
  title,
}: {
  lines: Line[];
  title: string;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const id = setTimeout(() => setVisible(lines.length), 0);
      return () => clearTimeout(id);
    }
    const timers = lines.map((_, i) =>
      setTimeout(() => setVisible((v) => Math.max(v, i + 1)), 450 + i * 320),
    );
    return () => timers.forEach(clearTimeout);
  }, [lines]);

  return (
    <div className="overflow-hidden rounded-2xl bg-surface-raised shadow-soft-lg ring-1 ring-hairline">
      <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
        <span className="ml-2 font-mono text-xs text-subtle">{title}</span>
      </div>

      <div className="space-y-2.5 p-5 font-mono text-sm">
        {lines.map((line, i) => {
          const isVisible = i < visible;
          const isActive = i === visible - 1;
          return (
            <p
              key={i}
              className={`transition-opacity duration-200 ${
                isVisible ? "opacity-100" : "opacity-0"
              } ${line.className ?? "text-foreground/80"}`}
            >
              {line.prompt && <span className="text-foreground/50">$ </span>}
              {line.text}
              {isActive && visible < lines.length && (
                <span className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 animate-pulse bg-foreground/70" />
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
