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
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = outer.getBoundingClientRect();
      const delta = r.top + r.height / 2 - window.innerHeight / 2;
      inner.style.transform = `translate3d(0, ${(delta * speed).toFixed(1)}px, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [speed]);

  return (
    <div ref={outerRef} className={className} style={style}>
      <div ref={innerRef} style={{ willChange: "transform" }}>
        {children}
      </div>
    </div>
  );
}
