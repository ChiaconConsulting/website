import { ImageResponse } from "next/og";

export const alt = "Chiacon: auditable AI and intelligent automation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #071a35 0%, #0c4885 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: 6 }}>CHIACON</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.08, maxWidth: 900 }}>
            AI your auditors can sign off on.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#4be3b5" }}>
            Auditable AI and intelligent automation
          </div>
        </div>
      </div>
    ),
    size,
  );
}
