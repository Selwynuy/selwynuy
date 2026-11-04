import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  ContactRound,
  Mail,
  Phone,
} from "lucide-react";
import {
  business,
  email,
  flagship,
  Icon,
  Mark,
  Monogram,
  mobileHref,
  mobileNumber,
  PortfolioPage,
  Socials,
} from "@/components/portfolio/shared";

export const metadata = {
  title: "Contact & links",
  description:
    "Save Selwyn Uy’s contact card, visit his portfolio, or find him online.",
  alternates: { canonical: "/links" },
  openGraph: { title: "Selwyn Uy · Contact & links", url: "/links" },
};

const links = [
  { label: "My portfolio", href: "/", mark: <Monogram /> },
  {
    label: "Genetrify",
    href: business,
    mark: <Mark file="genetrifyLogo.svg" />,
  },
  {
    label: "CSE Exam Review",
    href: flagship,
    mark: <Mark file="cseLogo.svg" />,
  },
  { label: "Email me", href: email, mark: <Icon glyph={Mail} /> },
  {
    label: `Call ${mobileNumber}`,
    href: mobileHref,
    mark: <Icon glyph={Phone} />,
  },
];

export default function LinksPage() {
  return (
    <PortfolioPage card>
      <section className="pf-links-wrap">
        <Link href="/" className="pf-back">
          <Icon glyph={ArrowLeft} />
          Back to portfolio
        </Link>
        <div className="pf-link-card">
          <Image
            src="/portfolio/avatar.webp"
            width={85}
            height={85}
            unoptimized
            className="pf-link-avatar"
            alt="Selwyn Uy"
          />
          <h1>Selwyn Uy.</h1>
          <p>
            Founder of Genetrify
            <br />
            Web & native iOS developer
          </p>
          <a
            className="pf-button pf-save"
            href="/selwyn-uy.vcf"
            download="selwyn-uy.vcf"
          >
            <Icon glyph={ContactRound} />
            Save contact
          </a>
          {links.map(({ label, href, mark }) => (
            <Link className="pf-link-row" href={href} key={label}>
              <span className="pf-link-label">
                {mark}
                <span className="pf-row-title">{label}</span>
              </span>
              <Icon glyph={ArrowUpRight} />
            </Link>
          ))}
          <Socials />
        </div>
      </section>
    </PortfolioPage>
  );
}
