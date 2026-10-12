import Link from "next/link";
import type { ReactNode } from "react";

// Turns URLs, emails, phone numbers and site paths inside a chat answer into real links.
// Builds React elements only (never raw HTML), and only these four shapes become links.
//   1 URL (http/https)   2 email   3 international phone number   4 internal site path
const TOKEN = /(https?:\/\/[^\s<>()]+)|([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+\d{1,3}(?:[\s-]\d{2,4}){2,4})|((?<![\w/.-])\/(?:#[\w-]+|resume\b|projects\/[\w-]+|docs\/[\w-]+|automations(?:\/[\w-]+)?(?:#[\w-]+)?))/g;

const LINK = "break-words text-cyan underline underline-offset-2 [overflow-wrap:anywhere] hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan";

export function LinkifiedText({ text, onNavigate }: { text: string; onNavigate?: () => void }) {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    let raw = m[0];
    let trailing = "";
    if (m[1] || m[2]) {
      // Sentence punctuation right after a link is not part of it.
      const t = /[.,;:!?]+$/.exec(raw);
      if (t) { trailing = t[0]; raw = raw.slice(0, -trailing.length); }
    }
    if (start > last) nodes.push(text.slice(last, start));
    if (m[1]) nodes.push(<a key={key++} href={raw} target="_blank" rel="noopener noreferrer" className={LINK}>{raw}</a>);
    else if (m[2]) nodes.push(<a key={key++} href={`mailto:${raw}`} className={LINK}>{raw}</a>);
    else if (m[3]) nodes.push(<a key={key++} href={`tel:${raw.replace(/[^\d+]/g, "")}`} className={LINK}>{raw.replace(/[ ]/g, "\u00a0")}</a>);
    else nodes.push(<Link key={key++} href={raw} onClick={onNavigate} className={LINK}>{raw}</Link>);
    if (trailing) nodes.push(trailing);
    last = start + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return <>{nodes}</>;
}
