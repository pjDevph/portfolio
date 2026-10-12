// Single source of truth for facts about Prince that appear on the site.
// The portfolio assistant's knowledge base is built from this file and
// projects.ts, so anything added here becomes something it can say.

export const PROFILE = {
  name: "Prince John Gandollas",
  title: "Full-Stack Engineer",
  location: "Binangonan, Rizal, Philippines",
  email: "pgandollas@gmail.com",
  phone: "+63 976 134 4061",
  phoneHref: "tel:+639761344061",
  linkedin: "https://linkedin.com/in/pjdevph",
  github: "https://github.com/pjDevph",
  resume: "/Prince_John_Gandollas_Resume.pdf",
  availability: "Available for engineering opportunities",
  focus: "Full-Stack, Backend, and Product Engineering",
};

// Canonical public address, used in documents that are generated offline (PDFs).
export const PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://pjdevph.vercel.app";

export type ExperienceItem = {
  date: string;
  org: string;
  role: string;
  projects: { name: string; period: string }[] | null;
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    date: "May 2025 – Sept 2026",
    org: "FINDXNY",
    role: "Junior Full-Stack Engineer",
    projects: [
      { name: "FINDXNY OS", period: "May 2026 – Jul 2026" },
      { name: "Lalaba", period: "Oct 2025 – Aug 2026" },
      { name: "Athlete Central", period: "May 2025 – Sept 2025" },
    ],
  },
  { date: "Apr 2021 – Apr 2025", org: "Department of Education", role: "Special Science Teacher I", projects: null },
  { date: "Dec 2019 – Mar 2021", org: "Iraseth Pharma Inc.", role: "Biomedical Engineer", projects: null },
];

// From the résumé page (src/app/resume/page.tsx). Keep in sync if the résumé changes.
export const SKILLS: Record<string, string[]> = {
  "Languages & Frontend": ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "React", "Next.js", "React Native", "Expo", "Tailwind CSS"],
  "Backend & Data": ["Node.js", "Express.js", "NestJS", "Deno", "GraphQL", "REST APIs", "PostgreSQL", "SQLite", "MongoDB", "Supabase", "Firebase"],
  "Cloud & Delivery": ["Google Cloud Platform", "Vercel", "EAS Build", "EAS Update", "Git", "GitHub", "GitHub Actions", "Electron"],
  "Architecture & Integrations": ["Multi-Tenant Architecture", "RBAC", "RLS", "Offline-First Sync", "Webhooks", "Idempotency", "Xendit", "Google Maps API", "ESC/POS", "Custom Expo Modules"],
};

export const EDUCATION = [
  "Bachelor of Science in Electronics Engineering, University of Rizal System (Apr 2019)",
  "Full-Stack Web Development (MERN), Zuitt Tech Program (Jan to Apr 2025)",
];

export const RESUME_SUMMARY =
  "Junior Full-Stack Engineer with 2+ years of hands-on experience building, scaling, and deploying production web and mobile systems (as stated on his résumé).";

export const CODE_SAMPLES = [
  "https://github.com/pjDevph/findxny-os-showcase",
  "https://github.com/pjDevph/lalaba-admin-showcase",
  "https://github.com/pjDevph/lalaba-backend-showcase",
];
