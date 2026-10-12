import { NextResponse } from "next/server";
import { clientIp, createRateLimiter } from "@/lib/rate-limit";

export const runtime = "nodejs";

const OWNER_EMAIL = process.env.CONTACT_TO_EMAIL || "pgandollas@gmail.com";
const FROM_EMAIL = process.env.CONTACT_FROM_EMAIL || "Prince John <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// 3 submissions per IP per 10 minutes (best-effort; see lib/rate-limit.ts).
const rateLimited = createRateLimiter(3, 10 * 60 * 1000, "contact");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never fill this hidden field. Pretend success to bots.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (name.length < 1 || name.length > 100) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 200) return NextResponse.json({ error: "Please enter a valid email." }, { status: 400 });
  if (message.length < 10 || message.length > 3000) return NextResponse.json({ error: "Message should be 10–3000 characters." }, { status: 400 });

  if (await rateLimited(clientIp(req))) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY is not set");
    return NextResponse.json({ error: "Contact form is not configured yet. Please email me directly." }, { status: 503 });
  }

  try {
    // 1) Notify me. Reply-To is the visitor so I can answer straight from my inbox.
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [OWNER_EMAIL],
      reply_to: email,
      subject: `Portfolio message from ${name}`,
      html: `<p><strong>${escapeHtml(name)}</strong> &lt;${escapeHtml(email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });

    // 2) Auto-reply to the visitor. Failure here shouldn't fail the submission.
    await sendEmail(apiKey, {
      from: FROM_EMAIL,
      to: [email],
      reply_to: OWNER_EMAIL,
      subject: "Thanks for reaching out — Prince John Gandollas",
      html: `<p>Hi ${escapeHtml(name)},</p>
<p>Thanks for your message. I've received it and will reply within 1–2 business days.</p>
<p>In the meantime, you can see my work at the portfolio or connect on <a href="https://linkedin.com/in/pjdevph">LinkedIn</a>.</p>
<p>— Prince John Gandollas<br/>Full-Stack Engineer</p>
<hr/><p style="color:#888;font-size:12px">This is an automatic acknowledgment. Your message:<br/><span style="white-space:pre-wrap">${escapeHtml(message)}</span></p>`,
    }).catch((err) => console.error("Auto-reply failed", err));

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact send failed", err);
    return NextResponse.json({ error: "Couldn't send your message. Please email me directly." }, { status: 502 });
  }
}
