"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/data/nav";

/** Disclosure menu for screens below the `md` breakpoint, where the inline nav is hidden. */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); buttonRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={open ? "Close menu" : "Open menu"}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-text transition hover:border-cyan/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
      >
        {open ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 top-16 z-40 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />
          <nav id="mobile-nav-panel" aria-label="Mobile navigation" className="absolute left-0 right-0 top-full z-50 border-b border-white/5 bg-ink px-5 py-3 shadow-soft">
            <ul>
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3.5 text-base text-text last:border-b-0">{l.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/automations" onClick={() => setOpen(false)} className="block py-3.5 text-sm text-muted">All automations</Link>
              </li>
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
