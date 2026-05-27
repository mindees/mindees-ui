import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ];

  // Every MDX page registered with the fumadocs source loader becomes a URL.
  // `getPages()` returns the resolved page objects with their full URLs already
  // prefixed by the loader's `baseUrl` (`/docs`).
  const docPages: MetadataRoute.Sitemap = source.getPages().map((p) => ({
    url: `${SITE_URL}${p.url}`,
    lastModified: now,
    changeFrequency: 'weekly',
    // Top-level docs get higher priority than deeply nested component pages.
    priority: p.slugs.length <= 1 ? 0.9 : 0.7,
  }));

  return [...staticPages, ...docPages];
}
