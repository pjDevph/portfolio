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
  detail: string;
  projects: { name: string; client: string; period: string }[] | null;
};

// All three FINDXNY projects were client work delivered by the same employer, not separate jobs.
// Last day at FINDXNY: 15 Sept 2026.
export const EXPERIENCE: ExperienceItem[] = [
  {
    date: "May 2025 – Sept 2026",
    org: "FINDXNY",
    role: "Junior Full-Stack Engineer",
    detail: "Delivered three client platforms end to end across web, mobile and backend, as part of a small engineering team.",
    projects: [
      { name: "FINDXNY OS", client: "MugTheMug", period: "May 2026 – Sept 2026" },
      { name: "Lalaba", client: "Lalaba", period: "Oct 2025 – Aug 2026" },
      { name: "Athlete Central", client: "Athlete Central", period: "May 2025 – Sept 2025" },
    ],
  },
  {
    date: "Apr 2021 – Apr 2025",
    org: "Department of Education",
    role: "Special Science Teacher I",
    detail: "Taught senior high school web development (HTML, CSS and JavaScript), plus programming, Science and Mathematics, through project-based learning.",
    projects: null,
  },
  {
    date: "Dec 2019 – Mar 2021",
    org: "Iraseth Pharma Inc.",
    role: "Biomedical Engineer",
    detail: "Preventive maintenance, troubleshooting, repair and technical support for biomedical equipment across partner healthcare facilities.",
    projects: null,
  },
];

// Rendered by the résumé page and its PDF (src/data/resume.ts). Keep in sync if the résumé changes.
export const SKILLS: Record<string, string[]> = {
  "Languages & Frontend": ["TypeScript", "JavaScript", "SQL", "HTML5", "CSS3", "React", "Next.js", "React Native", "Expo", "Tailwind CSS"],
  "Backend & Data": ["Node.js", "Express.js", "NestJS", "Deno", "GraphQL", "REST APIs", "PostgreSQL", "SQLite", "MongoDB", "Redis", "Supabase", "Firebase"],
  "Cloud & Delivery": ["Google Cloud Platform", "Vercel", "EAS Build", "EAS Update", "Git", "GitHub", "GitHub Actions", "Electron"],
  "Architecture & Integrations": ["Multi-Tenant Architecture", "RBAC", "RLS", "Offline-First Sync", "Webhooks", "Idempotency", "Xendit", "Google Maps API", "ESC/POS", "Custom Expo Modules"],
};

export const EDUCATION = [
  "Bachelor of Science in Electronics Engineering, University of Rizal System (Apr 2019)",
  "Full-Stack Web Development (MERN), Zuitt Tech Program (Jan to Apr 2025): built production-level full-stack applications with MongoDB, Express.js, React and Node.js",
];

export const RESUME_SUMMARY =
  "Full-Stack Engineer with nearly two years of hands-on full-stack development (the Zuitt MERN bootcamp from Jan 2025, then FINDXNY from May 2025 to Sept 2026) and four years teaching web development and programming.";

export const CODE_SAMPLES = [
  "https://github.com/pjDevph/findxny-os-showcase",
  "https://github.com/pjDevph/lalaba-admin-showcase",
  "https://github.com/pjDevph/lalaba-backend-showcase",
];
