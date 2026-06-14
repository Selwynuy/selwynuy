import { ImageResponse } from "next/og";
import { profile } from "@/lib/content/profile";

/**
 * Dynamic social share image (Open Graph + Twitter). Generated with next/og so
 * there is no static asset to keep in sync with the brand. Next wires this to
 * both og:image and twitter:image, which also fixes the summary_large_image
 * card that previously promised an image and shipped none.
 *
 * Brand: near-black (#0b0b0c) field, poster red (#e30613) accent, the S mark
 * rebuilt in markup (matching the favicon), name + role + hook. Statically
 * generated at build time.
 */

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const INK = "#0b0b0c";
const RED = "#e30613";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: "72px 80px",
          // Subtle red glow in the top-left, matching the site atmosphere.
          backgroundImage: `radial-gradient(900px 500px at 0% 0%, rgba(227,6,19,0.18), transparent 60%)`,
        }}
      >
        {/* Top: brand mark + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: RED,
              color: "#ffffff",
              fontSize: 64,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            S
          </div>
          <div
            style={{
              color: "#fafaf9",
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            {profile.name}
          </div>
        </div>

        {/* Middle: the hook, the line that should be remembered */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              color: "#fafaf9",
              fontSize: 68,
              fontWeight: 800,
              lineHeight: 1.05,
              maxWidth: 940,
            }}
          >
            {profile.hook}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "#a8a29e",
              fontSize: 30,
            }}
          >
            <div style={{ width: 40, height: 4, background: RED }} />
            {profile.role}
          </div>
        </div>

        {/* Bottom: domain, terminal-styled */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#78716c",
            fontSize: 28,
          }}
        >
          <span style={{ color: RED }}>$</span>
          selwynuy.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
