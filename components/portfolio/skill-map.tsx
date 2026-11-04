import {
  CodeXml,
  Database,
  GitBranch,
  ShieldCheck,
  Smartphone,
  Terminal,
} from "lucide-react";

const branches = [
  { x: 76, y: 40, label: "Web", tool: "Next.js & React", glyph: CodeXml },
  { x: 284, y: 40, label: "iOS", tool: "Swift", glyph: Smartphone },
  { x: 46, y: 132, label: "Data", tool: "Supabase", glyph: Database },
  { x: 314, y: 132, label: "Delivery", tool: "CI/CD & VPS", glyph: GitBranch },
  {
    x: 76,
    y: 223,
    label: "AI tools",
    tool: "Claude Code & Codex",
    glyph: Terminal,
  },
  {
    x: 284,
    y: 223,
    label: "Security",
    tool: "Web & API testing",
    glyph: ShieldCheck,
  },
];

export function SkillMap() {
  return (
    <figure className="pf-skill-map">
      <svg
        viewBox="0 0 360 284"
        role="img"
        aria-labelledby="skill-map-title skill-map-description"
      >
        <title id="skill-map-title">Selwyn’s development skills</title>
        <desc id="skill-map-description">
          {branches.map(({ label, tool }) => `${label}: ${tool}`).join(". ")}
        </desc>
        <g aria-hidden="true">
          {branches.map(({ x, y, label }) => (
            <line
              key={label}
              x1="180"
              y1="132"
              x2={x}
              y2={y}
              stroke="#c2cdc0"
            />
          ))}
          {branches.map(({ x, y, label, tool, glyph: Glyph }) => (
            <g key={label} transform={`translate(${x} ${y})`}>
              <circle r="28" fill="#fcfbf8" stroke="#8ca08e" />
              <circle
                cx="21"
                cy="-19"
                r="3"
                fill="#577560"
                stroke="#fcfbf8"
                strokeWidth="1.5"
              />
              <Glyph
                x="-8"
                y="-18"
                width="16"
                height="16"
                strokeWidth={1.6}
                stroke="#40634b"
              />
              <text
                textAnchor="middle"
                y="13"
                fontSize="12"
                fontWeight="650"
                fill="#20261f"
              >
                {label}
              </text>
              <text
                textAnchor="middle"
                y="45"
                fontSize="12.5"
                fill="#4d614f"
                stroke="#f3f4ee"
                strokeWidth="5"
                paintOrder="stroke"
              >
                {tool}
              </text>
            </g>
          ))}
          <circle cx="180" cy="132" r="33" fill="#263b2c" />
          <text
            x="178"
            y="142"
            textAnchor="middle"
            fontSize="32"
            fontWeight="800"
            letterSpacing="-3.2"
            fill="#fcfbf8"
          >
            su
          </text>
        </g>
      </svg>
    </figure>
  );
}
