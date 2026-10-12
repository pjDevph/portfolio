export type Status = "implemented" | "in-progress" | "planned";

export const STATUS_STYLE: Record<Status, { label: string; className: string }> = {
  implemented: { label: "Implemented", className: "border-success/30 bg-success/10 text-success" },
  "in-progress": { label: "In progress", className: "border-amber-400/30 bg-amber-400/10 text-amber-300" },
  planned: { label: "Planned", className: "border-line bg-panel2 text-muted" },
};

export function StatusPill({ status }: { status: Status }) {
  const s = STATUS_STYLE[status];
  return <span className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[.12em] ${s.className}`}>{s.label}</span>;
}
