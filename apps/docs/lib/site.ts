// Canonical site URL resolution.
//
// We prefer the production domain over per-deployment URLs so previews don't
// pollute the index with duplicate canonicals. Order of precedence:
//   1. NEXT_PUBLIC_SITE_URL  — explicit override (use this once mindees.dev DNS lands)
//   2. VERCEL_PROJECT_PRODUCTION_URL — stable production domain on Vercel
//   3. localhost — dev fallback

const raw =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const SITE_URL = raw.replace(/\/$/, '');

// Index in production only — preview deployments should `noindex` so Google
// doesn't see git-sha-stamped URLs as duplicate content.
export const SHOULD_INDEX = process.env.VERCEL_ENV === 'production' || !process.env.VERCEL_ENV;
