import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
  Plus,
} from "lucide-react";
import {
  PortfolioPage,
  Icon,
  Mark,
  Devices,
  Socials,
  Contact,
  socialProfiles,
  mobileNumber,
  mobileHref,
  business,
  email,
  flagship,
} from "@/components/portfolio/shared";
import { Experience, Credentials } from "@/components/portfolio/background";
import { HomeMotion } from "@/components/portfolio/home-motion";
import { notes } from "@/lib/content/notes";
import { SITE_URL } from "@/lib/site";

const projects = [
  {
    id: "taxkaya",
    name: "TAXKAYA",
    summary: "Bookkeeping app & guide website",
    url: "https://taxkaya.com",
    logo: "taxkayaLogo.svg",
  },
  {
    id: "choopi",
    name: "Choopi",
    summary: "Photo cleanup app & website",
    url: "https://choopi.genetrify.com",
    logo: "choopiLogo.svg",
  },
  {
    id: "reserve",
    name: "ReservePolomolok",
    summary: "Local discovery website",
    url: "https://reservepolomolok.com",
    logo: "reserveLogo.webp",
  },
] as const;

function Intro() {
  return (
    <div className="pf-opening">
      <section className="pf-hero">
        <div>
          <div className="pf-founder-line">
            <div className="pf-founder">
              Founder of{" "}
              <a href={business}>
                <Mark file="genetrifyLogo.svg" className="pf-mini-logo" />
                Genetrify
              </a>
            </div>
            <div className="pf-mobile-socials">
              <Socials />
            </div>
          </div>
          <h1>
            Selwyn Uy<span>.</span>
          </h1>
          <h2>
            I turn ideas into
            <br />
            working products.
          </h2>
          <p className="pf-hero-copy">
            I design, build, launch, and keep improving websites, web apps, and
            native iOS applications.
          </p>
          <div className="pf-hero-actions">
            <a
              className="pf-button"
              href={business}
              aria-label="Visit my company, Genetrify"
            >
              Visit my company
              <Icon glyph={ArrowUpRight} />
            </a>
            <a className="pf-button secondary" href={email}>
              Get in touch
              <Icon glyph={Mail} />
            </a>
          </div>
          <p className="pf-location">
            <Icon glyph={MapPin} />
            South Cotabato, Philippines · Working remotely
          </p>
        </div>
        <div className="pf-portrait">
          <Image
            src="/portfolio/portrait.webp"
            width={870}
            height={1088}
            preload
            unoptimized
            alt="Selwyn Uy wearing a barong"
          />
        </div>
      </section>
      <div className="pf-product-strip">
        <div
          className="pf-brand-row"
          role="group"
          aria-label="Products I founded"
        >
          <a href={flagship}>
            <Mark file="cseLogo.svg" />
            CSE Exam Review
          </a>
          {projects.slice(0, 2).map((p) => (
            <a href={p.url} key={p.id}>
              <Mark
                file={p.logo}
                className={p.id === "taxkaya" ? "pf-croc" : ""}
              />
              {p.name}
            </a>
          ))}
        </div>
        <Socials />
      </div>
    </div>
  );
}

function Work() {
  return (
    <>
      <section
        id="work"
        className="pf-genetrify"
        aria-labelledby="company-title"
      >
        <div className="pf-genetrify-copy">
          <Mark file="genetrifyLogo.svg" />
          <span className="pf-kicker">My company</span>
          <h2 id="company-title">Genetrify.</h2>
          <p>
            I founded Genetrify to build websites and software for small
            businesses. When you bring a project to Genetrify, you work directly
            with me.
          </p>
          <a className="pf-text-link" href={business}>
            Visit Genetrify
            <Icon glyph={ArrowUpRight} />
          </a>
        </div>
        <Devices id="genetrify" name="Genetrify" />
      </section>
      <section id="cse-exam-review" className="pf-feature">
        <div className="pf-feature-heading">
          <div>
            <span className="pf-kicker">Featured product</span>
            <div className="pf-title-row">
              <Mark file="cseLogo.svg" />
              <h2>CSE Exam Review</h2>
            </div>
          </div>
          <p>
            I built CSE Exam Review at Genetrify to help people prepare for the
            Civil Service Exam with public reviewers, timed mock exams, and
            focused practice.
          </p>
        </div>
        <Devices id="cse" name="CSE Exam Review" />
        <div className="pf-feature-footer">
          <p>
            Product developer at Genetrify
            <br />
            Next.js · TypeScript · PostgreSQL
          </p>
          <a className="pf-text-link" href={flagship}>
            Explore CSE Exam Review
            <Icon glyph={ArrowUpRight} />
          </a>
        </div>
      </section>
      <section className="pf-more-work">
        <div className="pf-section-head">
          <h2>More of my work.</h2>
          <span>Founded, built, and run by me.</span>
        </div>
        <div className="pf-work-grid">
          {projects.map((p) => (
            <article key={p.id} className="pf-project">
              <Devices id={p.id} name={p.name} />
              <div className="pf-project-top">
                <div className="pf-project-name">
                  <Mark file={p.logo} />
                  <div>
                    <h3>{p.name}</h3>
                    <p>{p.summary}</p>
                  </div>
                </div>
                <a
                  className="pf-project-link"
                  href={p.url}
                  aria-label={`Visit ${p.name}`}
                >
                  <Icon glyph={ArrowUpRight} />
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="pf-also-built">
          Also built ·{" "}
          <a href="https://napolcomexamreview.com">
            NAPOLCOM Exam Review <Icon glyph={ArrowUpRight} />
          </a>
        </p>
      </section>
    </>
  );
}

function Background() {
  return (
    <>
      <Experience />
      <section className="pf-honors" id="achievements" aria-labelledby="achievements-title">
        <div className="pf-section-head">
          <h2 id="achievements-title">Honors &amp; distinctions.</h2>
        </div>
        <div className="pf-honors-grid">
          {[
            {
              label: "Academic honors", title: "Cum laude",
              body: "BS Information Technology, Major in Database",
              credit: "Mindanao State University",
            },
            {
              label: "Civil Service Exam", title: "92.72%",
              body: "My rating on the Philippine Civil Service Exam.",
              link: { href: "/notes/inside-cse-exam-review", label: "Inside CSE Exam Review" },
            },
            {
              label: "Cybersecurity competitions", title: "National Top 4",
              body: "My team won the DICT Hack4Gov regional championship and placed Top 4 nationally in 2024.",
              credit: "Trend Micro uCTF: Top 4 nationally in 2024 and 2025.",
            },
          ].map((honor) => (
            <article key={honor.label} className="pf-honor">
              <div className="pf-honor-caption">
                <p className="pf-kicker">{honor.label}</p>
                <h3>{honor.title}</h3>
                <p>{honor.body}</p>
                {honor.credit && <p>{honor.credit}</p>}
                {honor.link && <Link href={honor.link.href} className="pf-text-link">
                  {honor.link.label}<Icon glyph={ArrowUpRight} />
                </Link>}
              </div>
            </article>
          ))}
        </div>
        <details className="pf-honor-results">
          <summary className="pf-awards-button">More competition results <Icon glyph={Plus} /></summary>
          <div className="pf-awards-details">
            <p><strong>Trend Micro uCTF, 2024 &amp; 2025.</strong> First in the qualifiers in both years.</p>
            <p><strong>AI Bayanihan Challenge, 2025.</strong> Top 2 in the regional startup competition.</p>
          </div>
        </details>
      </section>
    </>
  );
}

export default function Home() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Selwyn Uy",
    jobTitle: "Founder and developer",
    url: SITE_URL,
    sameAs: socialProfiles.map((s) => s.href),
    worksFor: { "@type": "Organization", name: "Genetrify", url: business },
  };
  return (
    <PortfolioPage>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <HomeMotion>
        <Intro />
        <Work />
        <Background />
        <Credentials />
        <section id="notes" className="pf-notes">
          <div className="pf-section-head">
            <h2>News & notes.</h2>
            <span>Products, progress, and things I’m learning.</span>
          </div>
          <div className="pf-note-grid">
            {notes.map((note) => (
              <article className="pf-note" key={note.slug}>
                <span>{note.category}</span>
                <h3>{note.title}</h3>
                <p>{note.intro}</p>
                <Link
                  href={`/notes/${note.slug}`}
                  className="pf-text-link"
                  aria-label={`Read ${note.title}`}
                >
                  Read note
                  <Icon glyph={ArrowUpRight} />
                </Link>
              </article>
            ))}
          </div>
        </section>
        <section id="contact" className="pf-contact-band">
          <div>
            <h2>
              Let’s build
              <br />
              something useful.
            </h2>
            <p>Have a project in mind? Start with a conversation.</p>
            <a
              className="pf-text-link min-h-11"
              href={mobileHref}
              aria-label={`Call Selwyn at ${mobileNumber}`}
            >
              <Icon glyph={Phone} /> {mobileNumber}
            </a>
          </div>
          <Contact />
        </section>
      </HomeMotion>
    </PortfolioPage>
  );
}
