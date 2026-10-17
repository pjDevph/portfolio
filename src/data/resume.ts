// The résumé, once. Both /resume and the downloadable PDF (/resume/print → npm run build:resume) render from here.
// EDUCATION in profile.ts (read by the assistant) must describe the same two entries as `education` below.
import { EXPERIENCE, PROFILE, SKILLS } from "@/data/profile";

export type ResumeProject = { name: string; client: string; period: string; stack: string; bullets: string[] };
export type ResumeRole = { title: string; org: string; period: string; text: string };

export const RESUME = {
  name: PROFILE.name,
  title: PROFILE.title,
  location: PROFILE.location,
  phone: PROFILE.phone,
  email: PROFILE.email,
  linkedin: PROFILE.linkedin.replace(/^https?:\/\//, ""),
  github: PROFILE.github.replace(/^https?:\/\//, ""),
  summary:
    "Full-Stack Engineer with nearly two years of hands-on development, delivering three production client platforms at FINDXNY across web, mobile and backend. Strongest in server-authoritative design: multi-tenant access control (RBAC/RLS), idempotent payments and webhooks, offline-first sync, and pricing and availability engines, using TypeScript, Next.js, React Native (Expo), NestJS, GraphQL, Supabase, Firebase, PostgreSQL and MongoDB. Four years teaching web development and a biomedical engineering background sharpen documentation and production troubleshooting.",
  skills: SKILLS,
  employer: {
    title: EXPERIENCE[0].role,
    org: EXPERIENCE[0].org,
    period: EXPERIENCE[0].date,
    text: EXPERIENCE[0].detail,
  },
  projects: [
    {
      name: "FINDXNY OS",
      client: "MugTheMug",
      period: "May 2026 – Sept 2026",
      stack: "Next.js · React Native (Expo) · Supabase · PostgreSQL · Deno Edge Functions · Xendit · EAS",
      bullets: [
        "Developed a multi-tenant POS and booking platform across a Next.js web app, an Expo cashier/kitchen terminal, and a Supabase backend with ~115 Edge Functions and 119 database migrations serving multiple business branches.",
        "Designed workspace-, branch- and role-based access for owners, admins, managers, cashiers and kitchen staff using PostgreSQL RLS, Edge Function middleware, route gating and PIN-based terminal login.",
        "Built a SQLite-backed offline sync queue with idempotent replay and recovery; authored native Expo modules for ESC/POS printing, cash drawers and secondary displays; integrated Xendit webhook deduplication, server-side pricing, EAS Build and OTA releases.",
      ],
    },
    {
      name: "Lalaba",
      client: "Lalaba",
      period: "Oct 2025 – Aug 2026",
      stack: "NestJS · GraphQL · MongoDB · Redis · React Native (Expo) · Next.js · Firebase · Xendit · Google Cloud",
      bullets: [
        "Developed a multi-role laundry marketplace with a NestJS/GraphQL backend, React Native customer and partner apps, and a Next.js admin platform for customers, shop staff and independent service providers.",
        "Designed branch-aware, permission-scoped authorization with staff device approval, plus server-side platform-fee and per-provider booking/availability engines that keep pricing and capacity consistent across clients.",
        "Integrated Xendit (idempotent wallet top-up webhook), Firebase Auth/Storage/App Check/Push and Google Maps; diagnosed Google Cloud/Firebase production configuration incidents and ran multi-environment EAS Build and OTA flows.",
      ],
    },
    {
      name: "Athlete Central",
      client: "Athlete Central",
      period: "May 2025 – Sept 2025",
      stack: "Next.js · React Native · Electron · Firebase · TypeScript · Tailwind CSS",
      bullets: [
        "Designed a shared Firebase Cloud Functions backend for customer web/mobile, Android POS and Electron admin clients, centralizing schedules, bookings and domain models across facilities.",
        "Built a multi-facility, multi-date booking cart with continuous time-slot merging and live availability; centralized standard, peak, weekend, holiday, entrance-fee and promotional pricing while separating booking and payment lifecycles.",
      ],
    },
  ] satisfies ResumeProject[],
  additional: EXPERIENCE.slice(1).map((e) => ({ title: e.role, org: e.org, period: e.date, text: e.detail })) satisfies ResumeRole[],
  education: [
    { title: "Bachelor of Science in Electronics Engineering", org: "University of Rizal System", period: "Apr 2019", text: "" },
    {
      title: "Full-Stack Web Development (MERN)",
      org: "Zuitt Tech Program",
      period: "Jan 2025 – Apr 2025",
      text: "Built production-level full-stack applications with MongoDB, Express.js, React and Node.js.",
    },
  ] satisfies ResumeRole[],
};
