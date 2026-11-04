"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Scroll-linked parallax wrapper. The outer element is measured, the inner
 * element is transformed, so the measurement never feeds back into itself.
 * `speed` is the fraction of the element's distance from the viewport center
 * applied as vertical offset: positive lags behind the scroll (reads deeper,
 * background), negative runs ahead of it (reads closer, foreground).
 * rAF-throttled, passive listener, and respects prefers-reduced-motion by
 * rendering static.
 */
export function Parallax({
  speed = 0.15,
  className = "",
  style,
  children,
}: {
  speed?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = false;

    function update() {
      frame = 0;
      if (!outer || !inner) return;
      const rect = outer.getBoundingClientRect();
      const distance = rect.top + rect.height / 2 - window.innerHeight / 2;
      inner.style.transform = `translate3d(0, ${(distance * speed).toFixed(1)}px, 0)`;
    }
    function schedule() {
      if (!frame && visible && !preference.matches)
        frame = requestAnimationFrame(update);
    }
    function sync() {
      cancelAnimationFrame(frame);
      frame = 0;
      if (preference.matches) inner?.style.removeProperty("transform");
      schedule();
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        sync();
      },
      { rootMargin: "160px" },
    );
    observer.observe(outer);
    preference.addEventListener("change", sync);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", sync);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      cancelAnimationFrame(frame);
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={className} style={style}>
      <div ref={innerRef}>{children}</div>
    </div>
  );
}
