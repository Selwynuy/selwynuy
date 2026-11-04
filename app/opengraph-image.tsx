import { ImageResponse } from "next/og";
import { profile } from "@/lib/content/profile";

export const alt = "Selwyn Uy, founder of Genetrify";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        ...size,
        background: "#fcfbf8",
        color: "#20261f",
        display: "flex",
        flexDirection: "column",
        padding: 80,
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex", color: "#40634b", fontSize: 34 }}>
        Founder of Genetrify
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <strong style={{ fontSize: 112 }}>{profile.name}.</strong>
        <span style={{ fontSize: 52 }}>{profile.hook}</span>
      </div>
      <span style={{ fontSize: 30 }}>selwynuy.dev</span>
    </div>,
    size,
  );
}
