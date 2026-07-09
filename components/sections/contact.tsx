"use client";

import { useState, type FormEvent } from "react";
import { profile } from "@/lib/content/profile";
import { Button } from "@/components/ui/button";

type Status = "idle" | "submitting" | "success" | "error";

const fieldClass =
  "w-full rounded-xl bg-surface-raised px-4 py-3 text-sm text-foreground ring-1 ring-hairline outline-none transition-shadow placeholder:text-subtle focus:shadow-soft-md focus:ring-foreground/20";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(body?.error ?? "Something went wrong.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section
      id="contact"
      className="mx-auto w-full max-w-5xl scroll-mt-20 px-5 py-14 sm:px-6 sm:py-24 lg:py-28 lg:pl-20 lg:pr-6"
    >
      <div className="grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-subtle">
            <span className="text-foreground">07</span>
            <span className="h-px w-8 bg-hairline" />
            Contact
          </p>
          <h2 className="display text-h2 text-foreground">
            Let&apos;s build something.
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
            Have a role, project, or idea in mind? Send a message and I&apos;ll
            get back to you. Or reach me directly at{" "}
            <a
              href={`mailto:${profile.email}`}
              className="text-foreground underline-offset-4 hover:underline"
            >
              {profile.email}
            </a>
            .
          </p>
          {profile.location && (
            <p className="mt-3 font-mono text-xs text-subtle">
              {profile.location}
            </p>
          )}
        </div>

        {status === "success" ? (
          <div className="flex items-center rounded-2xl bg-surface-raised p-8 shadow-soft-md">
            <p className="text-foreground">
              Thanks, your message is on its way. I&apos;ll be in touch soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Honeypot: hidden from users, bots tend to fill it. */}
            <div className="absolute -left-[9999px]" aria-hidden>
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                type="text"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Your name"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className={fieldClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Your message"
                className={`${fieldClass} resize-y`}
              />
            </div>

            {status === "error" && error && (
              <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Sending…" : "Send message"}
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
