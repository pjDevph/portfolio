"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

export type Shot = {
  src: string;
  alt: string;
  caption: string;
  /** Natural pixel size, so the viewer never crops or stretches the image. */
  width: number;
  height: number;
};

const SWIPE_PX = 50;

export function Lightbox({ shots, index, onIndex, onClose }: { shots: Shot[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const count = shots.length;
  const shot = shots[index];

  const go = useCallback((delta: number) => onIndex((index + delta + count) % count), [index, count, onIndex]);

  // Lock page scroll and restore focus to whatever opened the viewer.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      opener?.focus?.();
    };
  }, []);

  // Keyboard: Esc closes, arrows navigate, Tab stays inside the dialog.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") return onClose();
      if (e.key === "ArrowRight") return go(1);
      if (e.key === "ArrowLeft") return go(-1);
      if (e.key === "Tab" && dialogRef.current) {
        // Skip buttons hidden at this breakpoint (display:none) so first/last are really focusable.
        const f = Array.from(dialogRef.current.querySelectorAll<HTMLElement>("button:not([disabled])")).filter((el) => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s || count < 2) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? 1 : -1);
  }

  const btn = "flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur transition hover:border-cyan/70 hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan";

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Screenshot viewer, image ${index + 1} of ${count}`}
      className="fixed inset-0 z-[100] flex flex-col bg-black/96 backdrop-blur-sm"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="flex items-center justify-between px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <div className="font-mono text-xs uppercase tracking-[.16em] text-white/80" aria-live="polite">
          {String(index + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
        <button ref={closeRef} type="button" onClick={onClose} className={btn} aria-label="Close viewer"><X size={20} /></button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        <Image
          key={shot.src}
          src={shot.src}
          alt={shot.alt}
          width={shot.width}
          height={shot.height}
          sizes="100vw"
          priority
          className="max-h-full w-auto max-w-full rounded-lg object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {count > 1 && (
          <>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(-1); }} className={`${btn} absolute left-2 top-1/2 hidden -translate-y-1/2 sm:flex`} aria-label="Previous screenshot"><ChevronLeft size={22} /></button>
            <button type="button" onClick={(e) => { e.stopPropagation(); go(1); }} className={`${btn} absolute right-2 top-1/2 hidden -translate-y-1/2 sm:flex`} aria-label="Next screenshot"><ChevronRight size={22} /></button>
          </>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6" onClick={(e) => e.stopPropagation()}>
        <p className="max-w-3xl text-sm leading-6 text-white/85">{shot.caption}</p>
        {count > 1 && (
          <div className="flex gap-2 sm:hidden">
            <button type="button" onClick={() => go(-1)} className={btn} aria-label="Previous screenshot"><ChevronLeft size={22} /></button>
            <button type="button" onClick={() => go(1)} className={btn} aria-label="Next screenshot"><ChevronRight size={22} /></button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A grid of screenshot thumbnails that open in a fullscreen viewer.
 * Thumbnails letterbox (object-contain) inside a uniform frame so a grid stays
 * tidy without cropping any screenshot.
 */
export function ShotGallery({ shots, className = "", ratio = "aspect-[8/5]" }: { shots: Shot[]; className?: string; ratio?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const close = useCallback(() => setOpen(null), []);

  return (
    <>
      <div className={className}>
        {shots.map((s, i) => (
          <figure key={s.src} className="overflow-hidden rounded-2xl border border-line bg-panel">
            <button
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative block w-full bg-ink ${ratio} focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan`}
              aria-label={`Open fullscreen: ${s.caption}`}
            >
              <Image src={s.src} alt={s.alt} fill className="object-contain" sizes="(min-width: 1024px) 25vw, 50vw" />
              <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 max-sm:opacity-100" aria-hidden="true"><Maximize2 size={14} /></span>
            </button>
            <figcaption className="border-t border-line px-3 py-2.5 text-xs leading-5 text-muted-bright">{s.caption}</figcaption>
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox shots={shots} index={open} onIndex={setOpen} onClose={close} />}
    </>
  );
}
