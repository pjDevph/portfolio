"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type CarouselSlide = {
  src: string;
  alt: string;
  label: string;
  caption?: string;
};

export function ProductCarousel({
  slides,
  autoplaySeconds = 5,
  fit = "contain",
  compact = false,
  className = "",
}: {
  slides: CarouselSlide[];
  autoplaySeconds?: number;
  fit?: "cover" | "contain";
  compact?: boolean;
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => setInView((v) => (document.hidden ? false : v));
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (paused || !inView || document.hidden || slides.length <= 1) return;
    const id = setInterval(() => setActive((a) => (a + 1) % slides.length), autoplaySeconds * 1000);
    return () => clearInterval(id);
  }, [paused, inView, autoplaySeconds, slides.length]);

  function selectSlide(i: number) {
    setActive(i);
    setPaused(true);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPaused(false), 12000);
  }

  useEffect(() => () => { if (resumeTimer.current) clearTimeout(resumeTimer.current); }, []);

  const slide = slides[active];

  return (
    <div ref={rootRef} className={className} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className={`relative w-full overflow-hidden rounded-2xl border border-line bg-panel ${compact ? "aspect-[8/5]" : "aspect-[16/9]"}`}>
        {slides.map((s, i) => (
          <div key={s.src} className="absolute inset-0 transition-opacity duration-[350ms]" style={{ opacity: i === active ? 1 : 0 }}>
            <Image src={s.src} alt={s.alt} fill className={fit === "contain" ? "object-contain" : "object-cover"} sizes={compact ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 60vw, 100vw"} priority={i === 0} />
          </div>
        ))}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
          <div className="font-mono text-[10px] uppercase tracking-[.16em] text-white/90">{slide.label} — {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}</div>
        </div>
      </div>
      {!compact && slide.caption && (
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-bright">{slide.caption}</p>
      )}
      <div className={`mt-2.5 grid gap-2.5 ${slides.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {slides.map((s, i) => (
          <button
            key={s.src}
            type="button"
            onClick={() => selectSlide(i)}
            className={`relative overflow-hidden rounded-lg border transition ${compact ? "aspect-[8/5]" : "aspect-[16/9]"} ${i === active ? "border-cyan/70" : "border-line hover:border-slate-500/60"}`}
          >
            <Image src={s.src} alt={s.alt} fill className={fit === "contain" ? "object-contain" : "object-cover"} sizes="200px" />
            {i !== active && <div className="absolute inset-0 bg-ink/40" />}
            {!compact && (
              <span className="absolute bottom-1.5 left-2 font-mono text-[10px] uppercase tracking-[.12em] text-white/90">{s.label}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
