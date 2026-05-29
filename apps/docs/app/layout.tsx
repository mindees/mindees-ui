import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import 'fumadocs-ui/style.css';
import './globals.css';
import { SITE_URL, SHOULD_INDEX } from '@/lib/site';

export const metadata = {
  title: {
    default: 'MindeesUI — React Native components that understand layout context',
    template: '%s · MindeesUI',
  },
  description:
    'A React Native + Expo UI library whose components read your JSX structure and apply smart, predictable layout defaults. ~145 accessible components, 74 ready-made screen blocks, one-line theming. iOS, Android, and web — New Architecture.',
  metadataBase: new URL(SITE_URL),
  keywords: [
    'react native ui library',
    'react native component library',
    'react native ui kit',
    'expo ui kit',
    'expo components',
    'react native design system',
    'react native components',
    'react native web',
    'react native blocks',
    'react native templates',
    'react native theming',
    'layout intelligence',
    'auto spacing',
    'fabric',
    'new architecture',
    'unistyles',
    'reanimated',
    'accessibility',
    'wcag',
    'tamagui alternative',
    'gluestack alternative',
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
  robots: SHOULD_INDEX ? { index: true, follow: true } : { index: false, follow: false },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareSourceCode',
      name: 'MindeesUI',
      description:
        'React Native + Expo UI library with a deterministic Layout Intelligence Layer — ~145 accessible components, 74 ready-made screen blocks, and one-line theming for iOS, Android, and web.',
      codeRepository: 'https://github.com/mindees/mindees-ui',
      programmingLanguage: 'TypeScript',
      runtimePlatform: ['React Native', 'Expo', 'React Native Web'],
      license: 'https://github.com/mindees/mindees-ui/blob/main/LICENSE',
      url: SITE_URL,
      sameAs: [
        'https://www.npmjs.com/package/@mindees/ui',
        'https://www.npmjs.com/package/@mindees/blocks',
        'https://www.npmjs.com/package/@mindees/tokens',
        'https://www.npmjs.com/package/@mindees/icons',
      ],
      author: { '@type': 'Organization', name: 'MindeesUI contributors' },
    },
    {
      '@type': 'WebSite',
      name: 'MindeesUI',
      url: SITE_URL,
      description: 'Documentation for MindeesUI — universal React Native + Expo component library.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/docs?q={search_term_string}`,
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
