"use client";

import { useEffect, useRef, useState } from "react";

export type FlowStep = { label?: string; text: string };

const STEP_MS = 1400;

/**
 * A vertical process diagram where a "current" runs down the connecting line, step by step.
 * Steps always come from the project's real, documented flow data; nothing is generated here.
 * The animation only runs while visible, can be paused, and is off for reduced-motion users.
 */
export function FlowCurrent({ steps, ariaLabel }: { steps: FlowStep[]; ariaLabel: string }) {
  const root = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = visible && !paused && !reduced;
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), STEP_MS);
    return () => clearInterval(t);
  }, [running, steps.length]);

  return (
    <div>
      {!reduced && (
        <button type="button" className="flow-cur-pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
          {paused ? "Play animation" : "Pause animation"}
        </button>
      )}
      <ol ref={root} className="flow-cur" aria-label={ariaLabel}>
        {steps.map((s, i) => (
          <li key={i} className="flow-cur-item" data-on={reduced || !running ? undefined : i === active ? "now" : i < active ? "done" : undefined} data-flowing={running && i === active && i < steps.length - 1 ? "" : undefined}>
            <span className="flow-cur-node" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
            <div className="flow-cur-card">
              {s.label && <div className="text-sm font-semibold">{s.label}</div>}
              <p className={`text-sm leading-5 text-muted-bright ${s.label ? "mt-1.5" : ""}`}>{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
