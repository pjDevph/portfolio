import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const ogSize = { width: 1200, height: 630 };

type OgInput = { eyebrow: string; title: string; summary: string; image?: string; steps?: string[] };

/** Renders a 1200x630 share card: text on the left, a real product image on the right. */
export async function renderOg({ eyebrow, title, summary, image, steps }: OgInput) {
  const src = image ? `data:image/jpeg;base64,${(await readFile(path.join(process.cwd(), "public", image))).toString("base64")}` : null;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#090D14", backgroundImage: "radial-gradient(circle at 85% 20%, rgba(56,189,248,0.18), rgba(9,13,20,0) 55%)", color: "#F8FAFC", fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 560, padding: "56px 0 56px 64px" }}>
          <div style={{ display: "flex", alignItems: "center", fontSize: 34, fontWeight: 700 }}>
            PJ<span style={{ color: "#38BDF8" }}>.</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 20, letterSpacing: 3, color: "#38BDF8", textTransform: "uppercase" }}>{eyebrow}</div>
            <div style={{ marginTop: 18, fontSize: title.length > 18 ? 66 : 82, fontWeight: 800, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
            <div style={{ marginTop: 22, fontSize: 26, lineHeight: 1.35, color: "#94A3B8" }}>{summary}</div>
          </div>
          <div style={{ fontSize: 22, color: "#64748B" }}>Prince John Gandollas · Full-Stack Engineer</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "56px 56px 56px 32px" }}>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} width={528} height={330} alt="" style={{ width: 528, height: 330, objectFit: "contain", background: "#0F1623", borderRadius: 20, border: "2px solid #243044" }} />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", width: 528, padding: 28, background: "#0F1623", borderRadius: 20, border: "2px solid #243044" }}>
              {(steps ?? []).map((step, i) => (
                <div key={step} style={{ display: "flex", alignItems: "center", marginTop: i ? 12 : 0, padding: "12px 16px", borderRadius: 14, background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.1)", fontSize: 24 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, marginRight: 16, borderRadius: 17, background: "rgba(56,189,248,0.12)", border: "1px solid rgba(56,189,248,0.4)", color: "#38BDF8", fontSize: 18 }}>{i + 1}</div>
                  {step}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
