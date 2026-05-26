import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// On GitHub Pages without a custom domain, the site lives at
// `https://<owner>.github.io/<repo>/`, so all assets + links need a
// `/mindees-ui` prefix. Flip on by setting `DOCS_BASE_PATH` in the deploy
// workflow; local `pnpm docs dev` keeps the prefix empty so links work
// against `localhost:3000`.
const basePath = process.env.DOCS_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['fumadocs-ui'],
  },
  // Static HTML export for GitHub Pages / Cloudflare Pages / any static host.
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  // GitHub Pages serves URLs as folders (`/foo/index.html`) — match that
  // so links don't 404.
  trailingSlash: true,
  // Next's image optimiser needs a server; on static export it must be off.
  images: { unoptimized: true },
};

export default withMDX(config);
