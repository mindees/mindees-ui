import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import 'fumadocs-ui/style.css';

export const metadata = {
  title: { default: 'MindeesUI', template: '%s · MindeesUI' },
  description:
    'Universal React Native CLI + Expo component library with a deterministic Layout Intelligence Layer. ~60 accessible components for the New Architecture.',
  metadataBase: new URL('https://mindees.dev'),
  keywords: [
    'react-native',
    'expo',
    'ui library',
    'component library',
    'react native ui kit',
    'design system',
    'react native web',
    'fabric',
    'new architecture',
    'unistyles',
    'reanimated',
    'accessibility',
    'wcag',
    'layout intelligence',
    'mindees ui',
  ],
  authors: [{ name: 'MindeesUI contributors', url: 'https://github.com/mindees' }],
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

// JSON-LD: SoftwareSourceCode + WebSite. Helps Google understand what
// MindeesUI is and what queries to surface it on. Two graphs in one
// `<script type="application/ld+json">` keeps the payload tight.
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareSourceCode',
      name: 'MindeesUI',
      description:
        'Universal React Native CLI + Expo component library with a deterministic Layout Intelligence Layer.',
      codeRepository: 'https://github.com/mindees/mindees-ui',
      programmingLanguage: 'TypeScript',
      runtimePlatform: ['React Native', 'Expo', 'React Native Web'],
      license: 'https://github.com/mindees/mindees-ui/blob/main/LICENSE',
      url: 'https://mindees.dev',
      sameAs: [
        'https://www.npmjs.com/package/@mindees/ui',
        'https://www.npmjs.com/package/@mindees/tokens',
        'https://www.npmjs.com/package/@mindees/icons',
      ],
      author: { '@type': 'Organization', name: 'MindeesUI contributors' },
    },
    {
      '@type': 'WebSite',
      name: 'MindeesUI',
      url: 'https://mindees.dev',
      description: 'Documentation for MindeesUI — universal React Native + Expo component library.',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://mindees.dev/docs?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
