"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Send, X, RotateCcw, Mail, Copy, Check } from "lucide-react";
import { LinkifiedText } from "@/components/linkified-text";

type Msg = { role: "user" | "assistant"; content: string; notice?: string };

const MAX_CHARS = 600;
const SUGGESTIONS = [
  "What has Prince built?",
  "Tell me about FINDXNY OS",
  "What did Prince personally own on Lalaba?",
  "Is Prince available for work?",
];

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  execute: (id: string) => void;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window { turnstile?: TurnstileApi }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
let turnstileScript: Promise<void> | null = null;
function loadTurnstile() {
  turnstileScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { turnstileScript = null; reject(new Error("Couldn't load the verification check.")); };
    document.head.appendChild(s);
  });
  return turnstileScript;
}

/** Optional Cloudflare Turnstile: returns a function that yields a fresh single-use token per question. */
function useTurnstile() {
  const holder = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);
  const waiting = useRef<{ resolve: (t: string) => void; reject: (e: Error) => void } | null>(null);

  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    let cancelled = false;
    loadTurnstile().then(() => {
      if (cancelled || !holder.current || !window.turnstile) return;
      widget.current = window.turnstile.render(holder.current, {
        sitekey: TURNSTILE_SITE_KEY,
        execution: "execute",
        appearance: "interaction-only",
        callback: (token: string) => { waiting.current?.resolve(token); waiting.current = null; },
        "error-callback": () => { waiting.current?.reject(new Error("Verification failed. Please refresh and try again.")); waiting.current = null; },
      });
    }).catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, []);

  const getToken = useCallback(() => new Promise<string>((resolve, reject) => {
    if (!widget.current || !window.turnstile) return reject(new Error("Verification isn't ready yet. Please try again in a moment."));
    const timer = setTimeout(() => { waiting.current = null; reject(new Error("Verification timed out. Please try again.")); }, 20000);
    waiting.current = { resolve: (t) => { clearTimeout(timer); resolve(t); }, reject: (e) => { clearTimeout(timer); reject(e); } };
    window.turnstile.reset(widget.current);
    window.turnstile.execute(widget.current);
  }), []);

  return { holder, getToken, enabled: Boolean(TURNSTILE_SITE_KEY) };
}

/** Reads the route's newline-delimited JSON stream and reports text as it arrives. */
async function streamAnswer(messages: Msg[], onDelta: (t: string) => void, onNotice: (t: string) => void, signal: AbortSignal, turnstileToken?: string) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: messages.map(({ role, content }) => ({ role, content })), turnstileToken }),
    signal,
  });
  if (!res.ok || !res.body) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const raw = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!raw) continue;
      const evt = JSON.parse(raw) as { t: "delta" | "error" | "done" | "notice"; v?: string };
      if (evt.t === "notice" && evt.v) onNotice(evt.v);
      else if (evt.t === "delta" && evt.v) onDelta(evt.v);
      else if (evt.t === "error") throw new Error(evt.v || "Something went wrong.");
    }
  }
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for browsers or contexts where the async clipboard API is unavailable.
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text, who }: { text: string; who: "answer" | "message" }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  async function onCopy() {
    setState((await copyToClipboard(text)) ? "copied" : "failed");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 1800);
  }
  return (
    <>
      <button type="button" onClick={onCopy} aria-label={`Copy ${who}`} className="mt-1 inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px] text-dim transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan">
        {state === "copied" ? <Check size={11} aria-hidden="true" /> : <Copy size={11} aria-hidden="true" />}
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
      </button>
      <span className="sr-only" role="status">{state === "copied" ? "Copied to clipboard" : state === "failed" ? "Copy failed" : ""}</span>
    </>
  );
}

export function AssistantChat({ className = "", autoFocus = false, onNavigate }: { className?: string; autoFocus?: boolean; onNavigate?: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const turnstile = useTurnstile();

  useEffect(() => { if (autoFocus) inputRef.current?.focus(); }, [autoFocus]);
  useEffect(() => () => abortRef.current?.abort(), []);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight }); }, [messages, error]);

  const send = useCallback(async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    const history: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...history, { role: "assistant", content: "" }]);
    setInput("");
    setError("");
    setBusy(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const token = turnstile.enabled ? await turnstile.getToken() : undefined;
      await streamAnswer(history, (delta) => {
        setMessages((cur) => {
          const next = cur.slice();
          const last = next[next.length - 1];
          next[next.length - 1] = { ...last, content: last.content + delta };
          return next;
        });
      }, (notice) => {
        setMessages((cur) => {
          const next = cur.slice();
          next[next.length - 1] = { ...next[next.length - 1], notice };
          return next;
        });
      }, ctrl.signal, token);
    } catch (e) {
      if (ctrl.signal.aborted) return;
      setError(e instanceof Error ? e.message : "Something went wrong.");
      // Drop an empty placeholder so the failed turn doesn't leave a blank bubble.
      setMessages((cur) => (cur[cur.length - 1]?.content === "" ? cur.slice(0, -1) : cur));
    } finally {
      setBusy(false);
    }
  }, [busy, messages, turnstile]);

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setError("");
    setBusy(false);
    inputRef.current?.focus();
  }

  return (
    <div className={`flex min-h-0 flex-col ${className}`}>
      <div ref={logRef} role="log" tabIndex={0} aria-live="polite" aria-label="Conversation with the portfolio assistant" className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cyan">
        {messages.length === 0 && (
          <div>
            <p className="text-sm leading-6 text-muted-bright">Hi, I&apos;m an AI assistant that answers questions about Prince&apos;s work, using only the information on this portfolio.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUGGESTIONS.map((q) => (
                <button key={q} type="button" onClick={() => send(q)} className="rounded-full border border-line px-3 py-1.5 text-left text-xs text-muted-bright transition hover:border-cyan/70 hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan">{q}</button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => {
          const streaming = busy && i === messages.length - 1;
          return (
            <div key={i} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${m.role === "user" ? "bg-text text-ink" : "border border-line bg-panel2 text-text"}`}>
                {m.content
                  ? (m.role === "assistant" ? <LinkifiedText text={m.content} onNavigate={onNavigate} /> : m.content)
                  : (streaming ? <span className="text-dim" aria-label="Assistant is typing">Thinking…</span> : null)}
                {m.notice && m.content && <div className="mt-2 border-t border-line pt-2 text-[11px] leading-4 text-dim">{m.notice}</div>}
              </div>
              {m.content && !streaming && <CopyButton text={m.content} who={m.role === "user" ? "message" : "answer"} />}
            </div>
          );
        })}
        {error && (
          <div role="alert" className="rounded-xl border border-red-400/30 bg-red-400/5 px-3.5 py-2.5 text-sm leading-6 text-red-300">
            {error}{" "}
            <Link href="/#contact" className="underline underline-offset-2">Use the contact form</Link>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="border-t border-line p-3">
        <div ref={turnstile.holder} />
        <div className="flex items-end gap-2">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Ask a question about Prince</span>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              maxLength={MAX_CHARS}
              rows={1}
              placeholder="Ask about projects, skills, availability…"
              className="max-h-28 w-full resize-none rounded-xl border border-line bg-ink/60 px-3.5 py-2.5 text-sm text-text outline-none transition placeholder:text-dim focus:border-cyan/70"
            />
          </label>
          <button type="submit" disabled={busy || !input.trim()} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-text text-ink transition hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan" aria-label="Send question">
            <Send size={16} />
          </button>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-dim">
          <span>AI can be wrong · Powered by Claude</span>
          <span className="flex shrink-0 items-center gap-3 whitespace-nowrap">
            {messages.length > 0 && (
              <button type="button" onClick={reset} className="inline-flex items-center gap-1 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"><RotateCcw size={11} />New chat</button>
            )}
            <Link href="/#contact" className="inline-flex items-center gap-1 hover:text-text"><Mail size={11} />Contact Prince</Link>
          </span>
        </div>
      </form>
    </div>
  );
}

/** Floating launcher + panel, mounted once in the root layout. */
export function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  // The case-study page embeds the same assistant inline, so skip the floating one there.
  const path = usePathname() ?? "";
  const hidden = path.startsWith("/automations/portfolio-assistant") || path.startsWith("/docs/");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (hidden) return null;

  return (
    <>
      {open && (
        <section aria-label="Portfolio assistant" className="fixed bottom-20 right-4 z-50 flex h-[min(34rem,calc(100dvh-7rem))] w-[calc(100vw-2rem)] max-w-[24rem] flex-col overflow-hidden rounded-2xl border border-line bg-panel shadow-soft sm:right-6">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <div>
              <div className="text-sm font-semibold">Ask about Prince</div>
              <div className="font-mono text-[10px] uppercase tracking-[.14em] text-dim">AI assistant · portfolio only</div>
            </div>
            <button type="button" onClick={() => { setOpen(false); buttonRef.current?.focus(); }} className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan" aria-label="Close assistant"><X size={18} /></button>
          </div>
          <AssistantChat autoFocus className="flex-1" onNavigate={() => setOpen(false)} />
        </section>
      )}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="fixed bottom-4 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-text px-4 py-3 text-sm font-semibold text-ink shadow-soft transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan sm:right-6"
      >
        <MessageCircle size={17} aria-hidden="true" />{open ? "Close" : "Ask about Prince"}
      </button>
    </>
  );
}
