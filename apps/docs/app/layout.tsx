import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';
import 'fumadocs-ui/style.css';

export const metadata = {
  title: { default: 'MindeesUI', template: '%s · MindeesUI' },
  description:
    'Universal React Native CLI + Expo component library with a deterministic Layout Intelligence Layer.',
  metadataBase: new URL('https://mindees.dev'),
  openGraph: {
    type: 'website',
    siteName: 'MindeesUI',
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
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
