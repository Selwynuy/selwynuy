import { ArrowUpRight, Cloud, Award, Plus } from "lucide-react";
import {
  certifications,
  experience,
  skillBadges,
} from "@/lib/content/experience";
import type { Certification } from "@/lib/content/types";
import { Icon } from "./shared";

export function Experience() {
  return (
    <section
      className="pf-history"
      id="experience"
      aria-labelledby="experience-title"
    >
      <div className="pf-section-head">
        <h2 id="experience-title">Experience.</h2>
        <a href="#certifications" className="pf-text-link">
          View credentials ↓
        </a>
      </div>
      <ol className="pf-role-list">
        <li>
          <div>
            <span className="pf-kicker">Genetrify</span>
            <h3>Founder</h3>
            <p>
              I build websites and software for small businesses and work
              directly with clients from the first conversation through launch.
            </p>
          </div>
          <span className="pf-period">Current</span>
        </li>
        {experience.map((role) => (
          <li key={role.company}>
            <div>
              <span className="pf-kicker">{role.company}</span>
              <h3>{role.title}</h3>
              <p>{role.highlights[0]}</p>
            </div>
            <span className="pf-period">
              {role.period.replace(", Present", "–present")}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function CertificateList({ items }: { items: Certification[] }) {
  return (
    <ul className="pf-credential-list">
      {items.map((cert) => {
        const href = cert.url ?? cert.image;
        const label = (
          <>
            <Icon glyph={Award} />
            <span>
              {cert.name}
              <small>
                {cert.issuer} · {cert.year}
              </small>
            </span>
          </>
        );
        return (
          <li key={cert.name}>
            {href ? (
              <a href={href}>
                {label}
                <Icon glyph={ArrowUpRight} />
              </a>
            ) : (
              <div>{label}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function Credentials() {
  return (
    <section
      className="pf-credentials"
      id="certifications"
      aria-labelledby="certifications-title"
    >
      <div className="pf-section-head">
        <h2 id="certifications-title">Certifications.</h2>
      </div>
      <div className="pf-credential-grid">
        <div>
          <h3>Security credentials</h3>
          <CertificateList items={certifications.slice(0, 3)} />
          <details>
            <summary className="pf-awards-button">
              More certificates & training ({certifications.length - 3})
              <Icon glyph={Plus} />
            </summary>
            <CertificateList items={certifications.slice(3)} />
          </details>
        </div>
        <div>
          <h3>Google Cloud skill badges</h3>
          <ul className="pf-credential-list">
            {skillBadges.map((badge) => (
              <li key={badge.name}>
                <a href={badge.url}>
                  <Icon glyph={Cloud} />
                  <span>
                    {badge.name}
                    <small>
                      {badge.issuer} · {badge.year}
                    </small>
                  </span>
                  <Icon glyph={ArrowUpRight} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
