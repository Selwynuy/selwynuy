import Image from "next/image";
import Link from "next/link";
import { Manrope } from "next/font/google";
import { ArrowUpRight, type LucideIcon } from "lucide-react";
import { profile } from "@/lib/content/profile";
import "./portfolio.css";

const font = Manrope({ subsets: ["latin"], variable: "--font-personal" });
export const email = `mailto:${profile.email}`;
export const business = "https://genetrify.com";
export const flagship = "https://cseexamreview.com";
export const socialProfiles = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/selwyn.uy.7",
    logo: "facebookLogo.svg",
  },
  { name: "GitHub", href: profile.social.github, logo: "githubLogo.svg" },
  { name: "LinkedIn", href: profile.social.linkedin, logo: "linkedinLogo.svg" },
];

export function Icon({ glyph: Glyph }: { glyph: LucideIcon }) {
  return (
    <span className="pf-icon" aria-hidden="true">
      <Glyph />
    </span>
  );
}

export function Mark({
  file,
  className = "",
}: {
  file: string;
  className?: string;
}) {
  return (
    <Image
      src={`/portfolio/${file}`}
      alt=""
      width={48}
      height={48}
      unoptimized
      className={className}
    />
  );
}

export function Monogram() {
  return (
    <span className="pf-monogram" aria-hidden="true">
      su
    </span>
  );
}

export function Socials() {
  return (
    <div className="pf-socials">
      {socialProfiles.map(({ name, href, logo }) => (
        <a key={name} href={href} aria-label={`Selwyn on ${name}`}>
          <Mark file={logo} className="pf-social-icon" />
        </a>
      ))}
    </div>
  );
}

export function Contact() {
  return (
    <a className="pf-button" href={email} aria-label="Contact Selwyn by email">
      <span className="pf-label">Let’s talk</span>
      <Icon glyph={ArrowUpRight} />
    </a>
  );
}

export function PortfolioPage({
  children,
  card = false,
}: {
  children: React.ReactNode;
  card?: boolean;
}) {
  const brand = (
    <>
      <Monogram />
      <span>Selwyn Uy</span>
    </>
  );
  return (
    <div id="selwyn-personal-brand" className={font.variable}>
      <div className="pf-page">
        {!card && (
          <header className="pf-header">
            <Link href="/" className="pf-brand" aria-label="Selwyn Uy homepage">
              {brand}
            </Link>
            <nav className="pf-nav" aria-label="Main navigation">
              <Link href="/#work">Work</Link>
              <Link href="/#experience">Experience</Link>
              <Link href="/#notes">Notes</Link>
              <Link href="/links">Links</Link>
              <Contact />
            </nav>
          </header>
        )}
        <main id="main">{children}</main>
        {!card && (
          <footer className="pf-footer">
            <Link href="/" className="pf-brand">
              {brand}
            </Link>
            <p>© Selwyn Uy · Founder of Genetrify</p>
            <Link href="/docs" className="pf-text-link">
              Handbook
            </Link>
            <Link href="/links" className="pf-text-link">
              Find me online
              <Icon glyph={ArrowUpRight} />
            </Link>
          </footer>
        )}
      </div>
    </div>
  );
}

const grounds = {
  cse: "#edf1f5",
  genetrify: "#edf0e8",
  taxkaya: "#f0f4e8",
  choopi: "#f6ede0",
  reserve: "#f2eee7",
};

export function Devices({
  id,
  name,
}: {
  id: keyof typeof grounds;
  name: string;
}) {
  function screen(size: string) {
    return (
      <Image
        src={`/portfolio/${id}${size}.webp`}
        width={size === "Desktop" ? 950 : 320}
        height={size === "Desktop" ? 594 : 640}
        unoptimized
        alt=""
      />
    );
  }
  return (
    <div
      className="pf-device-viewer"
      style={{ background: grounds[id] }}
      role="img"
      aria-label={`${name} on laptop, tablet, and phone`}
    >
      <div className="pf-device-stage">
        <div className="pf-device pf-laptop">
          <div className="pf-laptop-lid">
            <div className="pf-laptop-screen">{screen("Desktop")}</div>
          </div>
          <div className="pf-laptop-base" />
        </div>
        <div className="pf-device pf-tablet">
          <div className="pf-tablet-screen">
            {screen(id === "genetrify" ? "Tablet" : "Mobile")}
          </div>
        </div>
        <div className="pf-device pf-phone">
          <div className="pf-phone-screen">{screen("Mobile")}</div>
        </div>
      </div>
    </div>
  );
}
