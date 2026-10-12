import { ATHLETE_ARCHITECTURE, FINDXNY_ARCHITECTURE, LALABA_ARCHITECTURE } from "@/data/project-details";

// End-to-end system maps (frontend -> API -> backend/services). Nodes come straight from the
// architecture data shown on each case study; connector labels restate documented behaviour only.
export type MapGroup = { title: string; nodes: string[]; accent?: boolean };
export type MapLayer = { groups: MapGroup[]; aside?: { title: string; text: string } };
export type SystemMapData = { layers: MapLayer[]; links: string[]; note: string };

const f = FINDXNY_ARCHITECTURE.tiers;
export const FINDXNY_MAP: SystemMapData = {
  layers: [
    { groups: [{ title: f[0].title, nodes: f[0].nodes }], aside: { title: f[4].title, text: f[4].nodes[0] } },
    { groups: [{ title: f[1].title, nodes: f[1].nodes, accent: true }] },
    { groups: [{ title: f[2].title, nodes: f[2].nodes }, { title: f[3].title, nodes: f[3].nodes }] },
  ],
  links: [
    "calls the Edge Functions · business rules never run on the client",
    "reads and writes under RLS · opens Xendit invoices · receives the payments-webhook callback",
  ],
  note: FINDXNY_ARCHITECTURE.note,
};

const l = LALABA_ARCHITECTURE.tiers;
export const LALABA_MAP: SystemMapData = {
  layers: [
    { groups: [{ title: l[0].title, nodes: l[0].nodes }] },
    { groups: [{ title: l[1].title, nodes: l[1].nodes, accent: true }] },
    { groups: [{ title: l[2].title, nodes: l[2].nodes }, { title: l[3].title, nodes: l[3].nodes }] },
  ],
  links: [
    `${l[0].arrowAfter ?? "GraphQL"} queries and mutations`,
    "reads and writes MongoDB · rate-limits with Redis · verifies identity with Firebase · opens Xendit invoices · receives the Xendit webhook",
  ],
  note: LALABA_ARCHITECTURE.note,
};

const a = ATHLETE_ARCHITECTURE.tiers;
export const ATHLETE_MAP: SystemMapData = {
  layers: [
    { groups: [{ title: a[0].title, nodes: a[0].nodes }] },
    { groups: [{ title: a[1].title, nodes: a[1].nodes, accent: true }] },
    { groups: [{ title: a[2].title, nodes: a[2].nodes }] },
  ],
  links: [a[0].arrowAfter ?? "", a[1].arrowAfter ?? ""],
  note: ATHLETE_ARCHITECTURE.note,
};
