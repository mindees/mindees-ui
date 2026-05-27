import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MindeesUI — Universal React Native CLI + Expo component library',
  description:
    'Universal React Native CLI + Expo component library with a deterministic Layout Intelligence Layer. ~60 accessible components for the New Architecture.',
  alternates: { canonical: '/' },
};

const features = [
  {
    icon: '⚙︎',
    title: 'Layout Intelligence Layer',
    body: 'Smart composition, not AI magic. Stacks auto-space by child type; primitives compose deterministically via Slot/asChild.',
  },
  {
    icon: '◆',
    title: 'Design tokens, separately',
    body: 'Colour, typography, spacing, radii, shadows, motion, breakpoints, z-index, density. Usable on its own as @mindees/tokens.',
  },
  {
    icon: '⌖',
    title: 'New Architecture only',
    body: 'Fabric, JSI, TurboModules, Bridgeless. Reanimated v4 worklets, FlashList v2, Unistyles v3 (Nitro).',
  },
  {
    icon: '⛚',
    title: 'Universal',
    body: 'React Native CLI + Expo SDK 55 & 56 on iOS, Android, React Native Web. One API, three platforms.',
  },
  {
    icon: '◎',
    title: 'Accessible',
    body: 'WCAG-conscious defaults, high-contrast tokens, a11y helpers (useFormFieldA11y, useAnnouncer, useUniqueId).',
  },
  {
    icon: '⌥',
    title: 'Strictly typed',
    body: 'TypeScript strict, no `any` in public API. CI gates on type / lint / format / test / build / bundle-budget.',
  },
];

const links = [
  {
    name: '@mindees/ui',
    sub: 'Components, hooks, providers',
    href: 'https://www.npmjs.com/package/@mindees/ui',
  },
  {
    name: '@mindees/tokens',
    sub: 'Design tokens, standalone',
    href: 'https://www.npmjs.com/package/@mindees/tokens',
  },
  {
    name: '@mindees/icons',
    sub: 'Tree-shakeable SVG icons',
    href: 'https://www.npmjs.com/package/@mindees/icons',
  },
  {
    name: 'GitHub',
    sub: 'Source, issues, releases',
    href: 'https://github.com/mindees/mindees-ui',
  },
];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden />
            v1.0.0 — live on npm
          </span>

          <h1 className="hero-title">
            The React Native UI kit
            <br />
            with a brain.
          </h1>

          <p className="hero-tagline">
            Universal React Native CLI + Expo component library with a deterministic{' '}
            <strong>Layout Intelligence Layer</strong>. ~60 accessible components for the New
            Architecture — Fabric, JSI, Reanimated v4, Unistyles v3, FlashList v2.
          </p>

          <div className="cta-row">
            <Link href="/docs" className="btn btn-primary">
              Get started →
            </Link>
            <a
              href="https://github.com/mindees/mindees-ui"
              className="btn btn-secondary"
              target="_blank"
              rel="noreferrer"
            >
              View on GitHub
            </a>
          </div>

          <div className="install-strip" role="region" aria-label="Install command">
            <code>pnpm add @mindees/ui @mindees/tokens @mindees/icons</code>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-eyebrow">Built right</p>
        <h2 className="section-title">Engineered, not assembled.</h2>
        <p className="section-sub">
          MindeesUI was designed from the brief up: every component is type-safe, composable, and
          measured against a per-component bundle budget enforced in CI.
        </p>

        <div className="feature-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon" aria-hidden>
                {f.icon}
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-body">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="code-section">
          <div>
            <p className="section-eyebrow">Composable</p>
            <h2 className="section-title">Stacks that space themselves.</h2>
            <p className="section-sub">
              The Layout Intelligence Layer reads child types — a Heading next to a Label gets
              tight spacing; an Input next to a Button gets loose. No more manually tuning every
              margin.
            </p>
            <Link href="/docs/architecture" className="btn btn-secondary">
              Read the architecture →
            </Link>
          </div>

          <div className="code-pane" aria-label="Example MindeesUI screen">
            <div className="code-pane-header">
              <span className="dot dot-r" />
              <span className="dot dot-y" />
              <span className="dot dot-g" />
              <span className="code-pane-name">LoginScreen.tsx</span>
            </div>
            <pre>
              {`import { `}
              <span className="tok-fn">VStack</span>
              {`, `}
              <span className="tok-fn">Heading</span>
              {`, `}
              <span className="tok-fn">Input</span>
              {`, `}
              <span className="tok-fn">Button</span>
              {` } from `}
              <span className="tok-str">'@mindees/ui'</span>
              {`;

export function `}
              <span className="tok-fn">LoginScreen</span>
              {`() {
  return (
    <`}
              <span className="tok-tag">VStack</span>
              {` `}
              <span className="tok-key">padding</span>
              {`="lg">
      <`}
              <span className="tok-tag">Heading</span>
              {`>Welcome back</`}
              <span className="tok-tag">Heading</span>
              {`>
      <`}
              <span className="tok-tag">Input</span>
              {` `}
              <span className="tok-key">label</span>
              {`="Email" `}
              <span className="tok-key">type</span>
              {`="email" />
      <`}
              <span className="tok-tag">Input</span>
              {` `}
              <span className="tok-key">label</span>
              {`="Password" `}
              <span className="tok-key">type</span>
              {`="password" />
      <`}
              <span className="tok-tag">Button</span>
              {`>Sign in</`}
              <span className="tok-tag">Button</span>
              {`>
    </`}
              <span className="tok-tag">VStack</span>
              {`>
  );
}`}
            </pre>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-eyebrow">Packages</p>
        <h2 className="section-title">Pick what you need.</h2>
        <p className="section-sub">
          Three packages, MIT-licensed, published to npm. Use them together or independently —
          tokens and icons work without the full UI kit.
        </p>

        <div className="link-grid">
          {links.map((l) => (
            <a
              key={l.name}
              href={l.href}
              className="link-card"
              target="_blank"
              rel="noreferrer"
            >
              <div>
                <div className="link-card-name">{l.name}</div>
                <div className="link-card-sub">{l.sub}</div>
              </div>
              <span className="link-card-arrow" aria-hidden>
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      <footer className="footer">
        MIT-licensed · Built by the{' '}
        <a href="https://github.com/mindees" target="_blank" rel="noreferrer">
          Mindees
        </a>{' '}
        contributors · v1.0.0
      </footer>
    </>
  );
}
