import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { source } from '@/lib/source';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <DocsLayout
      tree={source.pageTree}
      nav={{
        title: (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontWeight: 700 }}>
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: 22,
                height: 22,
                borderRadius: 6,
                background: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(280 91% 65%) 100%)',
              }}
            />
            MindeesUI
          </span>
        ),
      }}
      githubUrl="https://github.com/mindees/mindees-ui"
      links={[{ text: 'npm', url: 'https://www.npmjs.com/org/mindees', external: true }]}
    >
      {children}
    </DocsLayout>
  );
}
