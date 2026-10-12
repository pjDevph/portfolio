"use client";

import { useState } from "react";
import { Send, CheckCircle2 } from "lucide-react";

type Status = "idle" | "sending" | "sent" | "error";

const field = "w-full rounded-xl border border-line bg-ink/60 px-4 py-3 text-sm text-text placeholder:text-dim outline-none transition focus:border-cyan/70";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-success/30 bg-success/5 p-6">
        <CheckCircle2 className="text-success" size={24} />
        <div className="mt-3 text-lg font-semibold">Message sent.</div>
        <p className="mt-1 text-sm text-muted-bright">Thanks — I just sent a confirmation to your inbox and will reply within 1–2 business days. Check spam if you don&apos;t see it.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3" noValidate={false}>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" placeholder="Your name" className={field} />
        </label>
        <label className="block">
          <span className="sr-only">Email</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" placeholder="you@company.com" className={field} />
        </label>
      </div>
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea name="message" required minLength={10} maxLength={3000} rows={5} placeholder="Tell me about the role or project…" className={field} />
      </label>
      {/* Honeypot — hidden from people and assistive tech; bots fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === "sending"} className="inline-flex items-center gap-2 rounded-full bg-text px-5 py-3 text-sm font-semibold text-ink transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0">
          <Send size={16} />{status === "sending" ? "Sending…" : "Send message"}
        </button>
        <span className="text-xs text-dim">You&apos;ll get an automatic confirmation by email.</span>
      </div>
      {status === "error" && <p role="alert" className="text-sm text-red-400">{error}</p>}
    </form>
  );
}
