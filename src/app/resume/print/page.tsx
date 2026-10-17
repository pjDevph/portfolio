import type { Metadata } from "next";
import { RESUME, type ResumeRole } from "@/data/resume";

// Print layout for the downloadable PDF (npm run build:resume). Not linked anywhere; kept out of search.
export const metadata: Metadata = { title: "Résumé (print)", robots: { index: false, follow: false } };

function Roles({ items }: { items: ResumeRole[] }) {
  return <>{items.map((r) => (
    <div key={r.title} className="cv-item">
      <div className="cv-row"><b>{r.title} | {r.org}</b><span>{r.period}</span></div>
      {r.text && <p>{r.text}</p>}
    </div>
  ))}</>;
}

export default function ResumePrint() {
  const r = RESUME;
  return (
    <div className="cv-root">
      <header className="cv-head">
        <h1>{r.name}</h1>
        <div className="cv-title">{r.title}</div>
        <div className="cv-contact">{r.location} | {r.phone} | {r.email}</div>
        <div className="cv-contact">LinkedIn: {r.linkedin} | GitHub: {r.github}</div>
      </header>
      <h2>Professional Summary</h2>
      <p>{r.summary}</p>
      <h2>Technical Skills</h2>
      {Object.entries(r.skills).map(([g, items]) => <p key={g} className="cv-skill"><b>{g}:</b> {items.join(", ")}</p>)}
      <h2>Software Engineering Experience</h2>
      <div className="cv-row cv-employer"><b>{r.employer.title} | {r.employer.org}</b><span>{r.employer.period}</span></div>
      <p className="cv-note">{r.employer.text}</p>
      {r.projects.map((p) => (
        <div key={p.name} className="cv-item">
          <div className="cv-row"><b>{p.name}{p.client !== p.name && <span className="cv-client"> (client: {p.client})</span>}</b><span>{p.period}</span></div>
          <div className="cv-stack">{p.stack}</div>
          <ul>{p.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
      ))}
      <h2>Additional Experience</h2>
      <Roles items={r.additional} />
      <h2>Education & Training</h2>
      <Roles items={r.education} />
    </div>
  );
}
