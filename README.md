# Prince John Gandollas Portfolio

Static engineering portfolio built with Next.js, TypeScript, and Tailwind CSS.

## Pages
- `/` — homepage
- `/projects/findxny-os`
- `/projects/lalaba`
- `/projects/athlete-central`

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Production build
```bash
npm run build
npm start
```

## Before deployment
1. The `/resume` route is print-friendly and can be saved as PDF from the browser.
2. Replace the placeholder domain `https://pjdevph.dev` in `src/app/layout.tsx`, `src/app/sitemap.ts`, and `src/app/robots.ts` if your real domain is different.
3. Add real project screenshots under `public/projects/` and wire them into the project cards/case-study pages if desired.
4. Verify email, GitHub, and LinkedIn links.

## Deploy
Recommended: Vercel. Import this project from GitHub and deploy with default Next.js settings.

## UI/UX refresh included
- Rebalanced the desktop hero with an engineering systems visual.
- Tightened vertical spacing and section rhythm.
- Replaced repetitive project system panels with project-specific visuals.
- Promoted concrete engineering metrics and reduced stack-pill noise.
- Improved text contrast, anchor offsets, timeline date precision, and contact density.
- Added `autoprefixer` to devDependencies to fix the reported PostCSS build error.
