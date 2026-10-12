// Production URL on Vercel is exposed separately from the per-deployment URL;
// prefer it so share previews and the sitemap point at the canonical domain.
const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || (host ? `https://${host}` : "http://localhost:3000");
