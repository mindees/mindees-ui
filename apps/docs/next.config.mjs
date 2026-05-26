import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['fumadocs-ui'],
  },
  // Static export so the site can deploy anywhere — Vercel, Cloudflare Pages,
  // GitHub Pages, S3, anything that serves static HTML.
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
};

export default withMDX(config);
