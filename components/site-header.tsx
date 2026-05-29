"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/lib/content/profile";
import { ButtonLink } from "@/components/ui/button";

const navLinks = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 shadow-soft-sm backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="#top"
          className="text-sm font-semibold tracking-tight transition-opacity hover:opacity-70"
        >
          {profile.name}
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:bg-foreground/[0.04] hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ButtonLink href="#contact" className="px-4 py-2">
          Get in touch
        </ButtonLink>
      </nav>
    </header>
  );
}
