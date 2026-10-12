import type { DocBlock, ProjectDoc } from "@/data/docs";
import { PROFILE, PUBLIC_SITE_URL } from "@/data/profile";
import { docPdfPath } from "@/data/docs";

const PILL: Record<string, string> = { implemented: "doc-pill-implemented", "in-progress": "doc-pill-in-progress", planned: "" };
const PILL_LABEL: Record<string, string> = { implemented: "Implemented", "in-progress": "In progress", planned: "Planned" };

function Block({ b }: { b: DocBlock }) {
  switch (b.type) {
    case "h3": return <h3>{b.text}</h3>;
    case "p": return <p>{b.text}</p>;
    case "note": return <div className="doc-note">{b.text}</div>;
    case "list": {
      const Tag = b.ordered ? "ol" : "ul";
      return <Tag>{b.items.map((i) => <li key={i}>{i}</li>)}</Tag>;
    }
    case "kv": return <dl className="doc-kv">{b.rows.map(([k, v]) => <div key={k} style={{ display: "contents" }}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
    case "table":
      return (
        <table className="doc-table">
          <thead><tr>{b.head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
          <tbody>{b.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
        </table>
      );
    case "cards":
      return (
        <div className="doc-cards">
          {b.items.map((c) => (
            <div key={c.title} className="doc-card">
              <h4>{c.title}</h4>
              {c.tag && <div className="doc-tag">{c.tag}</div>}
              {c.text && <p>{c.text}</p>}
              {c.points && c.points.length > 0 && <ul>{c.points.map((p) => <li key={p}>{p}</li>)}</ul>}
            </div>
          ))}
        </div>
      );
    case "tiers":
      return (
        <div>
          {b.tiers.map((t, i) => (
            <div key={t.title}>
              <div className="doc-tier">
                <div className="doc-tier-title">{t.title}</div>
                <div className="doc-nodes">{t.nodes.map((n) => <span key={n} className="doc-node">{n}</span>)}</div>
              </div>
              {i < b.tiers.length - 1 && <div className="doc-arrow">↓ {t.arrowAfter ?? ""}</div>}
            </div>
          ))}
          {b.note && <div className="doc-note" style={{ marginTop: "3mm" }}>{b.note}</div>}
        </div>
      );
    case "triples":
      return (
        <div>
          {b.items.map((t) => (
            <div key={t.title} className="doc-triple">
              <h4>{t.title}</h4>
              <div className="doc-triple-cols">{t.cols.map(([label, text]) => <div key={label}><b>{label}</b><p>{text}</p></div>)}</div>
            </div>
          ))}
        </div>
      );
    case "status":
      return (
        <div>
          {b.items.map((s) => (
            <div key={s.title} className="doc-status">
              <strong>{s.title}</strong><span className={`doc-pill ${PILL[s.status]}`}>{PILL_LABEL[s.status]}</span>
              <div style={{ marginTop: "1mm" }}>{s.text}</div>
            </div>
          ))}
        </div>
      );
    case "images":
      return (
        <div>
          {b.items.map((i) => (
            <figure key={i.src} className="doc-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={i.src} alt={i.caption} />
              <figcaption>{i.caption}</figcaption>
            </figure>
          ))}
        </div>
      );
  }
}

/** Light, print-first document layout. Rendered at /docs/[slug] and printed to PDF by scripts/build-docs.ts. */
export function DocumentView({ doc, generated, pdf }: { doc: ProjectDoc; generated?: string; pdf?: { pages: number; kb: number; generated: string } }) {
  const size = pdf ? (pdf.kb >= 1024 ? `${(pdf.kb / 1024).toFixed(1)} MB` : `${pdf.kb} KB`) : null;
  return (
    <div className="doc-root">
      <header className="doc-toolbar">
        <a href={doc.caseStudyPath}>← Back to the case study</a>
        <span>
          <span className="doc-toolbar-title">{doc.title}: documentation preview</span>
          {pdf && <span className="doc-toolbar-meta"> · PDF · {pdf.pages} pages · {size} · generated {pdf.generated}</span>}
        </span>
        <a className="doc-btn" href={docPdfPath(doc.slug)} download>Download PDF</a>
      </header>
      <p className="doc-preview-note">This is a preview of the document. The PDF has the same content, laid out for A4 with page numbers.</p>
      <div className="doc-paper">
      <section className="doc-cover">
        <div>
          <div className="doc-eyebrow">{doc.kind} · Documentation</div>
          <h1 className="doc-title">{doc.title}</h1>
          <p className="doc-sub">{doc.subtitle}</p>
          <p className="doc-sub" style={{ marginTop: "6mm", fontSize: "11pt" }}>{doc.summary}</p>
          <dl className="doc-meta">
            {doc.meta.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <nav className="doc-toc" aria-label="Contents">
            <div className="doc-eyebrow" style={{ color: "#64748b" }}>Contents</div>
            <ol>{doc.sections.map((s) => <li key={s.title}>{s.title}</li>)}</ol>
          </nav>
        </div>
        <div className="doc-small">
          <strong style={{ color: "#0f172a" }}>{PROFILE.name}</strong> · {PROFILE.title}<br />
          {PROFILE.email} · <a href={PROFILE.linkedin}>LinkedIn</a> · <a href={PROFILE.github}>GitHub</a> · <a href={PUBLIC_SITE_URL}>{PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}</a><br />
          Generated from the portfolio&apos;s content{generated ? ` on ${generated}` : ""}. Live version: <a href={`${PUBLIC_SITE_URL}${doc.caseStudyPath}`}>{PUBLIC_SITE_URL.replace(/^https?:\/\//, "")}{doc.caseStudyPath}</a>
        </div>
      </section>

      <main>
        {doc.sections.map((s, i) => (
          <section key={s.title} className="doc-section">
            <h2>{i + 1}. {s.title}</h2>
            {s.blocks.map((b, j) => <Block key={j} b={b} />)}
          </section>
        ))}
      </main>
      </div>
    </div>
  );
}
