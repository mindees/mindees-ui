import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MindeesUI — React Native components that understand layout context',
  description:
    'A React Native + Expo UI library whose components read your JSX structure and apply smart, predictable layout defaults. ~145 accessible components, 74 ready-made screen blocks, one-line theming. iOS, Android, and web. New Architecture.',
  keywords: [
    'react native ui library',
    'react native component library',
    'expo ui kit',
    'react native design system',
    'react native components',
    'react native web',
    'layout intelligence',
    'auto spacing',
    'react native theming',
    'react native blocks',
    'react native templates',
    'tamagui alternative',
    'gluestack alternative',
  ],
  alternates: { canonical: '/' },
};

const features = [
  {
    icon: '⚙︎',
    title: 'Layout Intelligence Layer',
    body: 'Components read their children and apply deterministic spacing, sizing, and alignment. A Heading above a Label gets tight spacing; an Input above a Button gets loose. Not AI — documented, overridable rules.',
  },
  {
    icon: '◆',
    title: '~145 components',
    body: 'Inputs, selects, sliders, date/time/file pickers, tables, calendars, carousels, command palette, overlays, charts of state, media, navigation, and mobile gestures. All typed, all accessible.',
  },
  {
    icon: '⬚',
    title: '74 ready-made blocks',
    body: '@mindees/blocks ships login & checkout forms, dashboards, product cards, chat, settings, and full screens — composed from the primitives, restyle with tokens.',
  },
  {
    icon: '◑',
    title: 'Theme in one line',
    body: 'createThemes({ light: { brand }, dark: { brand } }) recolors your whole app from a single brand color. Hover/active shades and readable on-accent text are derived for you.',
  },
  {
    icon: '⛚',
    title: 'iOS · Android · Web',
    body: 'React Native CLI + Expo SDK 55 & 56 on all three platforms. New Architecture only — Fabric, JSI, Reanimated v4, Unistyles v3 (Nitro), FlashList v2. Tuned for low-end Android.',
  },
  {
    icon: '◎',
    title: 'Accessible & strict',
    body: 'WCAG-conscious defaults, high-contrast tokens, a11y helpers. TypeScript strict, no `any` in the public API, CI-gated on type / lint / test / build / bundle budget.',
  },
];

const links = [
  {
    name: '@mindees/ui',
    sub: '~145 components, hooks, providers',
    href: 'https://www.npmjs.com/package/@mindees/ui',
  },
  {
    name: '@mindees/blocks',
    sub: '74 ready-made screen blocks',
    href: 'https://www.npmjs.com/package/@mindees/blocks',
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
];

const BEFORE = `<View style={{ padding: 16, gap: 12, alignItems: "center" }}>
  <Text style={{ fontSize: 24, fontWeight: "700" }}>
    Upgrade Pro
  </Text>
  <Text style={{ textAlign: "center", color: "#666" }}>
    Unlock premium analytics and faster exports.
  </Text>
  <Pressable style={{ padding: 14, borderRadius: 12 }}>
    <Text>Continue</Text>
  </Pressable>
</View>`;

const AFTER = `<Card>
  <Stack center>
    <Title>Upgrade Pro</Title>
    <Text muted>
      Unlock premium analytics and faster exports.
    </Text>
    <Button>Continue</Button>
  </Stack>
</Card>`;

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="hero-inner">
          <span className="eyebrow">
            <span className="eyebrow-dot" aria-hidden />
            v1.1.0 — ~145 components &amp; 74 blocks, live on npm
          </span>

          <h1 className="hero-title">
            Beautiful React Native layouts
            <br />
            without babysitting spacing props.
          </h1>

          <p className="hero-tagline">
            MindeesUI is a New Architecture-first UI library for{' '}
            <strong>Expo and React Native</strong> that reads your component structure and applies
            smart, predictable layout defaults. <strong>Override anything. Ship faster.</strong>
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
              Star on GitHub
            </a>
          </div>

          <div className="install-strip" role="region" aria-label="Install command">
            <code>pnpm add @mindees/ui @mindees/tokens @mindees/icons</code>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-eyebrow">The idea</p>
        <h2 className="section-title">Components that understand their children.</h2>
        <p className="section-sub">
          Stop hand-tuning padding, alignment, and spacing on every screen. MindeesUI components
          derive those decisions from your JSX — deterministically, and always overridable.
        </p>

        <div className="before-after">
          <div className="ba-card ba-before">
            <span className="ba-tag">Before</span>
            <pre>{BEFORE}</pre>
          </div>
          <div className="ba-card ba-after">
            <span className="ba-tag">After · MindeesUI</span>
            <pre>{AFTER}</pre>
          </div>
        </div>
      </section>

      <section className="section">
        <p className="section-eyebrow">Built right</p>
        <h2 className="section-title">Engineered, not assembled.</h2>
        <p className="section-sub">
          Every component is type-safe, composable, accessible, and measured against a per-component
          bundle budget enforced in CI.
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
              The Layout Intelligence Layer reads child types — a Heading next to a Label gets tight
              spacing; an Input next to a Button gets loose. No more manually tuning every margin.
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
          Four packages, MIT-licensed, published to npm. Use them together or independently — tokens
          and icons work without the full UI kit, and blocks build on top.
        </p>

        <div className="link-grid">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="link-card" target="_blank" rel="noreferrer">
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
        contributors · v1.1.0
      </footer>
    </>
  );
}
