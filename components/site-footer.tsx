import { profile } from "@/lib/content/profile";

const links = [
  { label: "GitHub", href: profile.social.github },
  { label: "LinkedIn", href: profile.social.linkedin },
  { label: "Email", href: `mailto:${profile.email}` },
];

export function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-5xl px-6 py-10 lg:pl-20 lg:pr-6">
      <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {profile.name}
        </p>
        <div className="flex items-center gap-5">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
