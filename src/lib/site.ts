/**
 * Public base URL used for canonical links, sitemap, robots and Open Graph.
 * Set NEXT_PUBLIC_SITE_URL once there is a custom domain; until then we use
 * the production URL Vercel exposes, so links never point to a dead domain.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE_URL = resolveSiteUrl();
