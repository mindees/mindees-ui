<p align="center">
  <a href="https://mindees.dev">
    <img src="./mindees-logo.png" alt="MindeesUI — universal React Native + Expo component library" width="160" height="160" />
  </a>
</p>

<h1 align="center">MindeesUI</h1>

<p align="center">
  <b>The universal React Native CLI + Expo component library</b><br/>
  with a deterministic <b>Layout Intelligence Layer</b> that adapts spacing, sizing, alignment, roles, and styling to your content — automatically.
</p>

<p align="center">
  <a href="https://github.com/mindees/mindees-ui/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/mindees/mindees-ui/ci.yml?branch=main&label=CI&logo=github" alt="CI status" /></a>
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/v/@mindees/ui?label=%40mindees%2Fui&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/dm/@mindees/ui?label=downloads&logo=npm" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/ui"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/ui?label=size&logo=webpack" alt="Bundle size" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="https://github.com/mindees/mindees-ui/stargazers"><img src="https://img.shields.io/github/stars/mindees/mindees-ui?style=social" alt="GitHub stars" /></a>
</p>

<p align="center">
  <a href="https://mindees.dev"><b>Documentation</b></a> ·
  <a href="https://mindees.dev/docs"><b>Components</b></a> ·
  <a href="./docs/ARCHITECTURE.md"><b>Architecture</b></a> ·
  <a href="./docs/ROADMAP.md"><b>Roadmap</b></a> ·
  <a href="https://github.com/mindees/mindees-ui/discussions"><b>Discussions</b></a>
</p>

---

## Why MindeesUI?

Modern React Native UI libraries make you pick spacing, sizing, alignment, accessibility roles, and theming for every component — every time. MindeesUI flips that: drop children in, and the library figures out the right defaults by reading the structure you wrote. Override anything explicitly when you want to.

- ⚙️ **Deterministic Layout Intelligence Layer** — compound components + Slot/`asChild` + child introspection. Headings auto-space differently from body text. Buttons inside a group merge borders. Form inputs auto-wire their accessibility ids. Every rule is documented and overridable — never magic.
- 📱 **Universal** — Expo SDK 55 & 56 (RN 0.83 & 0.85), **New Architecture only** (Fabric + JSI + TurboModules + Bridgeless). iOS, Android, and React Native Web from one source.
- 🚀 **60 / 120 fps by design** — Reanimated worklets on the UI thread, FlashList for any long list, Unistyles v3 styling (no JS-side re-renders), tree-shakeable subpath exports, per-component bundle budgets enforced in CI.
- ♿ **Accessible by default** — WCAG 2.2 AA, screen-reader labels, `prefers-reduced-motion`, Dynamic Type, full RTL, native haptics. Every animation, every component.
- 🎨 **Themed end-to-end** — design tokens for colour, typography, spacing, radii, shadows, motion, breakpoints, z-index, and density. Light, dark, and high-contrast out of the box. `createTheme` for full custom themes.
- 🧠 **Strongly typed** — TypeScript `strict`, zero `any` in public API, polymorphic components, generics that survive `asChild` forwarding.
- 🧪 **Tested where it counts** — ≥ 90% coverage gate, a11y tests, Reassure perf regression on every PR, visual regression on the Storybook catalog.
- 🪶 **Tiny by default** — `sideEffects: false`, granular `exports`, no unused-component overhead.

## Quickstart

```sh
# install the library + tokens + icons
pnpm add @mindees/ui @mindees/tokens @mindees/icons

# install the New-Architecture peers
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-svg @shopify/flash-list
```

```tsx
import { ThemeProvider, PortalProvider, ErrorBoundary } from '@mindees/ui';

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <PortalProvider>
        <ErrorBoundary>{/* your app */}</ErrorBoundary>
      </PortalProvider>
    </ThemeProvider>
  );
}
```

When the primitive components land (Phase 2):

```tsx
import { Stack, Heading, Text, Button } from '@mindees/ui';

export function Hero() {
  return (
    <Stack padding="lg" gap="md">
      <Heading>Hello, MindeesUI</Heading>
      <Text tone="muted">Drop children in — the Layout Intelligence Layer handles the rest.</Text>
      <Button variant="primary" onPress={() => {}}>
        Get started
      </Button>
    </Stack>
  );
}
```

## Compatibility

| Runtime          | Supported               | Notes                                            |
| ---------------- | ----------------------- | ------------------------------------------------ |
| **Expo SDK**     | 55 · 56                 | both validated in CI; SDK 57 added when it ships |
| **React Native** | 0.83 · 0.85             | New Architecture only                            |
| **React**        | 19.1+                   |                                                  |
| **iOS**          | 15.1+                   | matches RN 0.85 baseline                         |
| **Android**      | API 24+                 | edge-to-edge default                             |
| **Web**          | ✅ via React Native Web | feasible components only                         |

See the full peer-dependency matrix in [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## What's in the box

| Layer                                                      | Status     | Highlights                                                                                                                                                 |
| ---------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design tokens** ([`@mindees/tokens`](./packages/tokens)) | ✅ shipped | colour scales + semantic + high-contrast, modular type scale, 4pt spacing, radii, shadows (iOS + Android), motion, breakpoints, z-index, density           |
| **Layout Intelligence Layer**                              | ✅ shipped | `Slot` / `asChild`, child introspection, intrinsic sizing (`fill` / `hug` / `fixed`), token-driven auto-spacing rules, specialised parent-child contexts   |
| **Theming & providers**                                    | ✅ shipped | `ThemeProvider` with system listeners (colour scheme, reduce motion, high contrast), `createTheme`, `PortalProvider`, `Portal`, `ErrorBoundary`            |
| **Layout & Typography primitives**                         | 🚧 Phase 2 | `Box`, `Stack` / `HStack` / `VStack` / `ZStack`, `Grid`, `Divider`, `Spacer`, `SafeAreaView`, `Text`, `Heading`, `Caption`, `Label`, `Link`, `Code`, `Kbd` |
| **Forms & Inputs**                                         | 🚧 Phase 3 | `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `DatePicker`, `OTPInput`, `PhoneInput`, `FileUpload`                               |
| **Buttons & Overlays**                                     | 🚧 Phase 4 | `Button`, `IconButton`, `FAB`, `ButtonGroup`, `Modal`, `BottomSheet`, `Toast`, `Tooltip`, `Popover`, `Drawer`, `Alert`, `ActionSheet`                      |
| **Navigation, Display & Data**                             | 🚧 Phase 5 | `Tabs`, `Card`, `Avatar`, `Badge`, `Image`, `Icon`, `List`, `Accordion`, `Progress`, `Skeleton`, `Stepper`, `Calendar`                                     |
| **Specialised**                                            | 🚧 Phase 6 | `QRCode`, `Barcode`, `MapView`, `CodeBlock`, `ColorPicker`, `SignaturePad`, `WebView`, `Camera` — all gated behind optional peers with graceful fallbacks  |
| **Docs site + SEO**                                        | 🚧 Phase 7 | Next.js + Fumadocs, live demos via Expo Snack, OG images, sitemap, JSON-LD, `llms.txt`, Core Web Vitals green                                              |
| **Publish**                                                | 🚧 Phase 8 | npm under `@mindees/*` via Changesets, docs to Cloudflare Pages                                                                                            |

Full roadmap with current progress: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Repository layout

```
mindees-ui/
├─ packages/
│  ├─ core/      → @mindees/ui     the library
│  ├─ tokens/    → @mindees/tokens design tokens
│  └─ icons/     → @mindees/icons  icon set
├─ apps/
│  ├─ example/   Expo + bare-compatible kitchen-sink app
│  └─ docs/      Next.js + Fumadocs documentation site
├─ .storybook/   cross-platform component catalogue
├─ docs/         COMPATIBILITY · ARCHITECTURE · ROADMAP · CONTRIBUTING · PERFORMANCE
└─ .github/      CI matrix, PR template, release workflow
```

## Performance

CI-enforced budgets, not vibes:

- **TypeScript strict** with public-API `any` blocked by ESLint
- **≥ 90% test coverage** on `@mindees/ui` (Jest + React Native Testing Library)
- **Reassure** render-perf regression guard on every PR (> 10% slowdown blocks merge)
- **Flashlight** runtime fps verification on a low-end Android target before release
- **Per-subpath bundle budgets** enforced by [`scripts/check-bundle-budget.mjs`](./scripts/check-bundle-budget.mjs)
- **Version drift** between [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md) and npm caught by [`scripts/verify-versions.mjs`](./scripts/verify-versions.mjs)

Details in [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).

## Contributing

PRs and issues welcome. The full quality gate (typecheck, lint, format, tests with coverage, build, bundle budget, perf regression) runs on every PR. See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) for setup, scripts, and the per-component Definition of Done.

```sh
git clone https://github.com/mindees/mindees-ui.git
cd mindees-ui && pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm example start    # boot the Expo kitchen-sink
pnpm docs dev         # boot the docs site
```

## Sponsors & acknowledgements

MindeesUI builds on the shoulders of an outstanding open-source community: **React Native**, **Expo**, **Reanimated**, **Gesture Handler**, **Unistyles**, **FlashList**, **react-native-svg**, **Fumadocs**, **Turborepo**, **Changesets**, and many more. Thank you.

## License

[MIT](./LICENSE) © 2026 MindeesUI contributors

<p align="center">
  <sub>Built for the <a href="https://reactnative.dev/blog">React Native New Architecture</a> · Designed in the open at <a href="https://github.com/mindees">github.com/mindees</a></sub>
</p>
