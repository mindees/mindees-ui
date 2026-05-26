import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import 'fumadocs-ui/style.css';

export const metadata = {
  title: { default: 'MindeesUI', template: '%s · MindeesUI' },
  description:
    'Universal React Native CLI + Expo component library with a deterministic Layout Intelligence Layer.',
  metadataBase: new URL('https://mindees.dev'),
  openGraph: {
    type: 'website',
    siteName: 'MindeesUI',
    images: [{ url: '/opengraph-image.png', width: 1024, height: 1024, alt: 'MindeesUI' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: [{ url: '/twitter-image.png', alt: 'MindeesUI' }],
  },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  // app/icon.png and app/apple-icon.png are picked up automatically by
  // Next.js's file-based metadata convention — no explicit `icons` entry needed.
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
