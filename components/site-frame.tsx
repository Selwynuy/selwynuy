"use client";

import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";

export function SiteFrame({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (path === "/" || path === "/links" || path.startsWith("/notes/")) {
    return children;
  }
  return (
    <>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
