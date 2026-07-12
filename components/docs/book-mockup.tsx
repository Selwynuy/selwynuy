"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CoverCard } from "@/components/docs/cover-card";

const REST_TILT = { rx: 6, ry: -24 };

/**
 * A true CSS 3D book: a front cover face, a page-edge block along the right
 * side (built from a thin div rotated into the Z plane), and a faint back
 * cover, all inside one `transform-style: preserve-3d` box. Sits at a resting
 * angle and responds to the pointer with a subtle parallax tilt, plus a slow
 * idle float so it never looks like a static image. Respects
 * prefers-reduced-motion: no float, no pointer-tilt, just the resting angle.
 */
export function BookMockup({
  size = 300,
  kicker,
  title,
  accentWord,
  sub,
  footer,
  className = "",
}: {
  size?: number;
  kicker: string;
  title: string;
  accentWord?: string;
  sub?: string;
  footer?: { left: ReactNode; right: string };
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState(REST_TILT);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    // Deferred off the effect body to satisfy the React Compiler lint rule
    // (same pattern as components/theme-toggle.tsx).
    const id = setTimeout(() => {
      setReduceMotion(
        window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      );
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      rx: REST_TILT.rx + (0.5 - py) * 20,
      ry: REST_TILT.ry + (px - 0.5) * 26,
    });
  }

  function handlePointerLeave() {
    setTilt(REST_TILT);
  }

  const height = Math.round(size * (296 / 210));
  const depth = Math.round(size * 0.1);

  return (
    <div
      className={`book-float ${className}`}
      style={{ width: size, height }}
    >
      <div
        ref={wrapRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="h-full w-full"
        style={{ perspective: 1800 }}
      >
        <div
          className="relative h-full w-full transition-transform duration-300 ease-out"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          }}
        >
          {/* Back cover: faint, sits behind the front face by the book's depth. */}
          <div
            aria-hidden
            className="absolute inset-0 rounded-r-md"
            style={{
              background: "var(--color-ink-900)",
              transform: `translateZ(-${depth / 2}px)`,
            }}
          />

          {/* Page edge: a thin strip rotated 90 degrees into the Z axis, so
              it reads as the book's paper thickness along the right side. */}
          <div
            aria-hidden
            className="absolute"
            style={{
              top: 2,
              bottom: 2,
              left: "100%",
              width: depth,
              transformOrigin: "left center",
              transform: "rotateY(90deg)",
              background:
                "repeating-linear-gradient(to bottom, #efece2 0px, #efece2 2px, #d8d3c4 2px 3px)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.35)",
            }}
          />

          {/* Bottom edge, same treatment, ties the page-block together. */}
          <div
            aria-hidden
            className="absolute"
            style={{
              left: 2,
              right: 2,
              top: "100%",
              height: depth,
              transformOrigin: "top center",
              transform: "rotateX(-90deg)",
              background:
                "repeating-linear-gradient(to right, #efece2 0px, #efece2 2px, #d8d3c4 2px 3px)",
              boxShadow: "inset 0 0 6px rgba(0,0,0,0.35)",
            }}
          />

          {/* Front cover. */}
          <div
            className="absolute inset-0 overflow-hidden rounded-r-md shadow-soft-lg ring-1 ring-white/10"
            style={{ transform: `translateZ(${depth / 2}px)` }}
          >
            <CoverCard
              width={size}
              kicker={kicker}
              title={title}
              accentWord={accentWord}
              sub={sub}
              footer={footer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
