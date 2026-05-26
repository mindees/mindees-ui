<p align="center">
  <a href="https://mindees.dev">
    <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI — universal React Native and Expo component library with a deterministic Layout Intelligence Layer" width="160" height="160" />
  </a>
</p>

<h1 align="center">@mindees/ui</h1>

<p align="center">
  <b>The universal React Native + Expo UI component library</b> for the New Architecture.<br/>
  Drop children in — the deterministic <b>Layout Intelligence Layer</b> handles spacing, sizing, alignment, accessibility, and theming automatically.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/v/@mindees/ui?label=%40mindees%2Fui&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/dm/@mindees/ui?label=downloads&logo=npm" alt="monthly downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/ui"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/ui?label=size" alt="bundle size" /></a>
  <a href="https://github.com/mindees/mindees-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License" /></a>
  <a href="https://github.com/mindees/mindees-ui/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/mindees/mindees-ui/ci.yml?branch=main&label=CI&logo=github" alt="CI status" /></a>
</p>

<p align="center">
  <a href="https://mindees.dev"><b>Documentation</b></a> ·
  <a href="https://github.com/mindees/mindees-ui"><b>GitHub</b></a> ·
  <a href="https://github.com/mindees/mindees-ui/blob/main/docs/ARCHITECTURE.md"><b>Architecture</b></a> ·
  <a href="https://github.com/mindees/mindees-ui/blob/main/docs/ROADMAP.md"><b>Roadmap</b></a>
</p>

---

## Why MindeesUI

`@mindees/ui` is a **React Native component library** built for **Expo SDK 55 / 56** (React Native 0.83 / 0.85) on the **New Architecture only** — Fabric, JSI, TurboModules, and Bridgeless mode. It works on **iOS, Android, and React Native Web** from one codebase, and ships every component with **TypeScript strict types, WCAG 2.2 AA accessibility, Reanimated v4 UI-thread animations, and Unistyles v3 zero-re-render theming**.

The differentiator is a **deterministic Layout Intelligence Layer**: a Radix-style `Slot`/`asChild` pattern + child introspection + token-driven auto-spacing + intrinsic `fill`/`hug`/`fixed` sizing + specialised parent–child contexts. Drop a heading next to a paragraph and the gap is computed for you; nest a `Button` in a `ButtonGroup` and the outer corners merge automatically; wrap an `Input` in a `FormField` and accessibility ids wire themselves up. Every rule is documented and overridable — never a black box.

## Features

- 🧠 **Deterministic Layout Intelligence Layer** — compound components, Radix-style `Slot` / `asChild`, child introspection, auto-spacing, intrinsic sizing, parent–child contexts. Smart composition, not AI magic.
- 📱 **Universal React Native + Expo + React Native Web** — one codebase ships to iOS, Android, and the web from Expo SDK 55 or 56.
- ⚡ **New Architecture only** — Fabric + JSI + TurboModules + Bridgeless. No legacy bridge overhead.
- 🚀 **60 / 120 fps by design** — `react-native-reanimated` worklets on the UI thread, `@shopify/flash-list` for long lists, `react-native-unistyles` v3 Nitro-powered styling with zero JS re-renders, per-component bundle budgets enforced in CI.
- ♿ **Accessibility-first** — WCAG 2.2 AA, screen reader labels, `prefers-reduced-motion`, Dynamic Type, full RTL, native haptics via `expo-haptics` when present.
- 🎨 **Design tokens & theming** — colour scales (semantic + high-contrast), modular typography scale, 4-point spacing, radii, shadows, motion, breakpoints, z-index, density. Light, dark, and high-contrast themes out of the box. `createTheme` for fully custom brand themes.
- 🧪 **Tested** — Jest + React Native Testing Library, Reassure perf-regression on every PR, Storybook catalogue.
- 🪶 **Tree-shakeable** — `sideEffects: false`, subpath exports per component; you only pay for what you import.
- 🧠 **TypeScript strict** — zero `any` in the public API, polymorphic components, generics that survive `asChild` ref forwarding.

## Install

```sh
pnpm add @mindees/ui @mindees/tokens @mindees/icons

# New-Architecture peers
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-svg @shopify/flash-list
```

Also installable with `npm` or `yarn`.

## Quickstart

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

Once the primitives land (Phase 2):

```tsx
import { Stack, Heading, Text, Button } from '@mindees/ui';

export function Hero() {
  return (
    <Stack padding="lg" gap="md">
      <Heading>Build mobile apps faster</Heading>
      <Text tone="muted">
        Drop components in — spacing, sizing, alignment, and accessibility just work.
      </Text>
      <Button variant="primary" onPress={() => {}}>
        Get started
      </Button>
    </Stack>
  );
}
```

## Compatibility

| Runtime          | Versions               | Notes                    |
| ---------------- | ---------------------- | ------------------------ |
| **Expo SDK**     | 55, 56                 | both validated in CI     |
| **React Native** | 0.83, 0.85             | New Architecture only    |
| **React**        | 19.1+                  |                          |
| **iOS**          | 15.1+                  |                          |
| **Android**      | API 24+                | edge-to-edge default     |
| **Web**          | via `react-native-web` | feasible components only |

Full peer-dependency matrix: [`docs/COMPATIBILITY.md`](https://github.com/mindees/mindees-ui/blob/main/docs/COMPATIBILITY.md).

## How does it compare?

|                                         | MindeesUI | NativeBase | Tamagui    | Gluestack UI |
| --------------------------------------- | --------- | ---------- | ---------- | ------------ |
| Deterministic Layout Intelligence Layer | ✅        | —          | —          | —            |
| New Architecture only (Fabric / JSI)    | ✅        | partial    | ✅         | ✅           |
| Unistyles v3 (Nitro, zero re-renders)   | ✅        | —          | own engine | own engine   |
| Compound components + Slot / asChild    | ✅        | partial    | ✅         | ✅           |
| Tree-shakeable subpath exports          | ✅        | partial    | ✅         | ✅           |
| Built-in tokens + high-contrast theme   | ✅        | partial    | ✅         | partial      |
| MIT licence                             | ✅        | ✅         | MIT        | MIT          |

## FAQ

### What is MindeesUI?

MindeesUI is an open-source **React Native UI component library** for **Expo** and bare React Native CLI apps. It bundles a design system, accessibility-first components, theming, and a **deterministic Layout Intelligence Layer** that auto-derives correct spacing, sizing, alignment, and accessibility props from the shape of your JSX tree.

### Does it work with Expo Router?

Yes. The example app uses **expo-router** v56 and wraps the root layout in `ThemeProvider` / `PortalProvider` / `ErrorBoundary`. See the [example app](https://github.com/mindees/mindees-ui/tree/main/apps/example).

### Does it support React Native Web?

Yes, where the underlying primitives support web rendering (most of the layout, typography, button, and form components). Native-only components (camera, signature pad) are gated behind optional peers.

### Is it accessible?

Yes — every component ships with **WCAG 2.2 AA** roles and labels, `prefers-reduced-motion` is honoured by every animation, **Dynamic Type** scales typography, **RTL** layouts are correct, and high-contrast themes are built in. A11y is a quality gate, not an afterthought.

### Will it support the old React Native architecture (Paper)?

No. MindeesUI is **New Architecture only** (Fabric + JSI + TurboModules + Bridgeless). The old bridge has fundamental perf and ergonomics limitations that the library actively relies on the new architecture to avoid.

### Can I use it with a custom design system?

Yes. `createTheme({ name, colorScheme, contrast, density, colors })` produces a `Theme` from your overrides on top of the default token scale. Build brand themes without forking the library.

## Documentation

- [Getting Started](https://mindees.dev/docs)
- [Architecture & Layout Intelligence Layer](https://github.com/mindees/mindees-ui/blob/main/docs/ARCHITECTURE.md)
- [Compatibility Matrix](https://github.com/mindees/mindees-ui/blob/main/docs/COMPATIBILITY.md)
- [Performance Budgets](https://github.com/mindees/mindees-ui/blob/main/docs/PERFORMANCE.md)
- [Contributing](https://github.com/mindees/mindees-ui/blob/main/docs/CONTRIBUTING.md)
- [Roadmap](https://github.com/mindees/mindees-ui/blob/main/docs/ROADMAP.md)

## Keywords

react-native · expo · expo-sdk-56 · expo-sdk-55 · react-native-new-architecture · fabric · react-native-fabric · react-native-jsi · turbomodules · ui-library · component-library · design-system · react-native-ui-kit · react-native-components · cross-platform-ui · universal-react-native · ios · android · react-native-web · typescript · strict-types · unistyles · react-native-unistyles · react-native-reanimated · flash-list · accessibility · wcag · a11y · rtl · dynamic-type · prefers-reduced-motion · dark-mode · high-contrast · design-tokens · theming · layout-intelligence · radix · slot · as-child · compound-components · child-introspection · intrinsic-sizing · auto-spacing · mobile-ui · react-native-design-system · expo-router · react-19 · new-arch

## License

[MIT](https://github.com/mindees/mindees-ui/blob/main/LICENSE) © 2026 MindeesUI contributors
