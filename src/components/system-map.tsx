"use client";

import { useState } from "react";
import type { SystemMapData } from "@/data/system-maps";

/** Layered end-to-end map: each layer talks to the next through a labelled, animated connector. */
export function SystemMap({ data, ariaLabel }: { data: SystemMapData; ariaLabel: string }) {
  const [paused, setPaused] = useState(false);
  return (
    <figure aria-label={ariaLabel} className={paused ? "sysmap sysmap-paused" : "sysmap"}>
      <button type="button" className="flow-cur-pause sysmap-pause" onClick={() => setPaused((p) => !p)} aria-pressed={paused}>
        {paused ? "Play animation" : "Pause animation"}
      </button>
      {data.layers.map((layer, i) => (
        <div key={i}>
          <div className="arch-tier">
            <div className={`grid gap-3 ${layer.groups.length > 1 ? "md:grid-cols-2" : ""}`}>
              {layer.groups.map((g) => (
                <div key={g.title}>
                  <div className="mb-3 font-mono text-[10px] uppercase tracking-[.18em] text-dim">{g.title}</div>
                  <div className={`grid gap-2 ${layer.groups.length === 1 && g.nodes.length > 1 ? (g.nodes.length === 3 ? "sm:grid-cols-3" : g.nodes.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-2") : ""}`}>
                    {g.nodes.map((n) => <div key={n} className={g.accent ? "arch-node cyan" : "arch-node"}>{n}</div>)}
                  </div>
                </div>
              ))}
            </div>
            {layer.aside && (
              <div className="mt-3 rounded-xl border border-dashed border-cyan/30 px-3 py-2 text-xs leading-5 text-muted-bright">
                <span className="font-mono text-[10px] uppercase tracking-[.14em] text-cyan">{layer.aside.title}: </span>{layer.aside.text}
              </div>
            )}
          </div>
          {i < data.links.length && (
            <div className="sysmap-link" aria-hidden="true">
              <span className="sysmap-wire"><i className="sysmap-dot down" /><i className="sysmap-dot up" /></span>
              <span className="sysmap-label">{data.links[i]}</span>
            </div>
          )}
        </div>
      ))}
      <figcaption className="mt-4 text-xs text-dim">{data.note}</figcaption>
    </figure>
  );
}
