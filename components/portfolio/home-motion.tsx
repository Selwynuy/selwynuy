"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { inView } from "motion";

export function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;
    const targets = root.current.querySelectorAll(
      ".pf-device-stage, .pf-honors-grid",
    );
    // CSS supplies the natural resting position, including before hydration.
    return inView(
      targets,
      (element) => {
        element.classList.add("pf-in-view");
      },
      { amount: 0.18 },
    );
  }, []);

  return (
    <div ref={root} className="pf-inner">
      {children}
    </div>
  );
}
