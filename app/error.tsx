"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/ui/button";

/**
 * Branded runtime error boundary. Catches unexpected errors in the page tree
 * (the root layout, header, and footer keep rendering around it) and shows a
 * recover-or-leave fallback in the same visual language as the 404, so a crash
 * still feels like part of the site. Must be a Client Component.
 */
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // In production this is where you forward to your error tracker (see the
    // Observability handbook page). Console keeps it visible in development.
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate flex min-h-[70vh] items-center overflow-hidden px-5 py-24 sm:px-6">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-dot-grid [mask-image:radial-gradient(75%_60%_at_50%_0%,#000_25%,transparent_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-glow"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 select-none text-center"
      >
        <span className="block font-semibold leading-[0.8] tracking-tighter text-foreground/[0.04] [font-size:clamp(8rem,28vw,22rem)]">
          500
        </span>
      </div>

      <div className="mx-auto w-full max-w-2xl text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5 font-mono text-xs text-muted shadow-soft-sm ring-1 ring-hairline">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Something broke
        </p>

        <h1 className="display text-4xl text-foreground sm:text-5xl">
          That did not go as planned.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-muted">
          An unexpected error interrupted this page. You can try again, and if it
          keeps happening, head back home.
        </p>

        {error.digest && (
          <p className="mt-3 font-mono text-xs text-subtle">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => unstable_retry()}>Try again</Button>
          <ButtonLink href="/" variant="ghost">
            Back to home
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
