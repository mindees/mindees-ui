<p align="center">
  <a href="https://mindees.dev">
    <img src="./mindees-logo.png" alt="MindeesUI — universal React Native and Expo component library with a deterministic Layout Intelligence Layer" width="160" height="160" />
  </a>
</p>

<h1 align="center">MindeesUI</h1>

<p align="center">
  <b>The universal React Native CLI + Expo component library</b> for the New Architecture.<br/>
  Drop children in — a deterministic <b>Layout Intelligence Layer</b> handles spacing, sizing, alignment, accessibility, and styling automatically. Every rule is documented and overridable. Never a black box.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/v/@mindees/ui?label=%40mindees%2Fui&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/ui"><img src="https://img.shields.io/npm/dm/@mindees/ui?label=downloads&logo=npm" alt="npm downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/ui"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/ui?label=size&logo=webpack" alt="bundle size" /></a>
  <a href="https://github.com/mindees/mindees-ui/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/mindees/mindees-ui/ci.yml?branch=main&label=CI&logo=github" alt="CI status" /></a>
  <a href="./LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT license" /></a>
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

## Table of contents

- [Why MindeesUI](#why-mindeesui)
- [Features at a glance](#features-at-a-glance)
- [Compatibility](#compatibility)
- [Installation](#installation)
  - [Expo SDK 55 / 56](#installation-expo-sdk-55--56)
  - [Bare React Native CLI](#installation-bare-react-native-cli)
  - [React Native Web (via Next.js or Expo Web)](#installation-react-native-web)
- [Project setup](#project-setup)
  - [Babel + Reanimated](#babel--reanimated)
  - [Metro & monorepo](#metro--monorepo)
  - [Unistyles bootstrap](#unistyles-bootstrap)
  - [Wrap your app](#wrap-your-app)
- [The Layout Intelligence Layer](#the-layout-intelligence-layer)
  - [Slot / asChild](#slot--aschild)
  - [Tagged components & child introspection](#tagged-components--child-introspection)
  - [Intrinsic sizing (`fill` / `hug` / fixed)](#intrinsic-sizing)
  - [Auto-spacing rules](#auto-spacing-rules)
  - [Specialised parent–child contexts](#specialised-parentchild-contexts)
- [Theming](#theming)
  - [`ThemeProvider`](#themeprovider)
  - [`createTheme`](#createtheme)
  - [Hooks: `useTheme`, `useTokens`, `useReduceMotion`](#theming-hooks)
- [Providers](#providers)
  - [`PortalProvider` + `Portal`](#portalprovider--portal)
  - [`ErrorBoundary`](#errorboundary)
- [Accessibility](#accessibility)
- [Performance](#performance)
- [What's in the box (component status)](#whats-in-the-box-component-status)
- [Comparison with alternatives](#comparison-with-alternatives)
- [FAQ](#faq)
- [Repository layout](#repository-layout)
- [Contributing](#contributing)
- [License](#license)

---

## Why MindeesUI

Modern React Native UI libraries make you pick spacing, sizing, alignment, accessibility roles, and theming for every component — every time. MindeesUI flips that: drop children in, and the library figures out the right defaults by reading the structure you wrote. Override anything explicitly when you want to.

Built for **Expo SDK 55 / 56** (React Native 0.83 / 0.85) on the **New Architecture only** — Fabric, JSI, TurboModules, Bridgeless. Ships on **iOS, Android, and React Native Web** from one codebase, with **TypeScript strict types, WCAG 2.2 AA accessibility, Reanimated v4 UI-thread animations, and Unistyles v3 zero-re-render theming**.

The differentiator is a **deterministic Layout Intelligence Layer** — a Radix-style `Slot` / `asChild` pattern, child introspection, token-driven auto-spacing, intrinsic `fill` / `hug` / `fixed` sizing, and specialised parent–child contexts. Smart composition, not AI magic.

## Features at a glance

- ⚙️ **Deterministic Layout Intelligence Layer** — compound components, `Slot` / `asChild`, child introspection, auto-spacing, intrinsic sizing, parent–child contexts. Every rule documented and overridable.
- 📱 **Universal** — Expo SDK 55 & 56 (RN 0.83 / 0.85), iOS, Android, **React Native Web**. One codebase.
- ⚡ **New Architecture only** — Fabric + JSI + TurboModules + Bridgeless. No legacy bridge overhead.
- 🚀 **60 / 120 fps by design** — Reanimated v4 worklets, FlashList v2, Unistyles v3 Nitro styling, per-component bundle budgets enforced in CI.
- ♿ **Accessibility-first** — WCAG 2.2 AA, screen-reader labels, `prefers-reduced-motion`, Dynamic Type, full RTL, native haptics.
- 🎨 **Design tokens & theming** — colour, typography, spacing, radii, shadows, motion, breakpoints, z-index, density. Light, dark, and high-contrast out of the box.
- 🧠 **TypeScript strict** — zero `any` in the public API, polymorphic components, generics that survive `asChild` ref forwarding.
- 🧪 **Tested** — Jest + React Native Testing Library, Reassure perf-regression on every PR, Storybook catalogue.
- 🪶 **Tiny by default** — `sideEffects: false`, granular subpath exports.

## Compatibility

| Runtime          | Versions                  | Notes                    |
| ---------------- | ------------------------- | ------------------------ |
| **Expo SDK**     | 55, 56                    | both validated in CI     |
| **React Native** | 0.83, 0.85                | New Architecture only    |
| **React**        | 19.1+                     |                          |
| **iOS**          | 15.1+                     | matches RN 0.85 baseline |
| **Android**      | API 24+                   | edge-to-edge default     |
| **Web**          | ✅ via `react-native-web` | feasible components only |
| **Node**         | 20+ (22 LTS recommended)  | for the toolchain        |

See the full peer-dependency matrix in [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

---

## Installation

### Installation: Expo SDK 55 / 56

```sh
# Library + tokens + icons
pnpm add @mindees/ui @mindees/tokens @mindees/icons

# New-Architecture peers
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-screens react-native-svg @shopify/flash-list

# Optional peers (only install if you use the matching components)
pnpm add expo-image expo-haptics expo-blur
```

`npm install` / `yarn add` work too — the workspace uses `pnpm` but any package manager installs `@mindees/*`.

### Installation: Bare React Native CLI

```sh
npm install @mindees/ui @mindees/tokens @mindees/icons
npm install react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-screens react-native-svg @shopify/flash-list

# iOS pods
cd ios && pod install && cd ..
```

### Installation: React Native Web

Use the components directly inside a Next.js / Vite / Expo Web app. React Native Web has to be aliased correctly:

```js
// next.config.mjs
export default {
  transpilePackages: [
    '@mindees/ui',
    '@mindees/tokens',
    '@mindees/icons',
    'react-native-web',
    'react-native-reanimated',
    'react-native-gesture-handler',
    '@shopify/flash-list',
  ],
};
```

The example docs site at [`apps/docs`](./apps/docs) is a Next.js 16 + Fumadocs setup.

---

## Project setup

### Babel + Reanimated

Reanimated v4 needs its Babel plugin listed **last**.

```js
// babel.config.js  (Expo)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin'],
  };
};
```

```js
// babel.config.js  (bare RN)
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: ['react-native-reanimated/plugin'],
};
```

### Metro & monorepo

If you're consuming MindeesUI from a **pnpm monorepo** (recommended), point Metro at the workspace root so the library's source is watched. The example app's [`metro.config.js`](./apps/example/metro.config.js) shows the canonical pattern.

```js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
```

### Unistyles bootstrap

Unistyles v3 uses `StyleSheet.configure()` at module load. Add a `unistyles.ts` file to your app root and import it once from `App.tsx`. Configuration is wired automatically through `<ThemeProvider>` in Phase 2 once `createStyles` ships; for now, a minimal bootstrap:

```ts
// unistyles.ts
import { StyleSheet } from 'react-native-unistyles';
import { lightTheme, darkTheme } from '@mindees/ui';

StyleSheet.configure({
  themes: { light: lightTheme, dark: darkTheme },
  breakpoints: lightTheme.tokens.breakpoints,
  settings: { adaptiveThemes: true },
});
```

```tsx
// App.tsx
import './unistyles';
import { ... } from '@mindees/ui';
```

### Wrap your app

```tsx
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, PortalProvider, ErrorBoundary } from '@mindees/ui';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider mode="auto">
          <PortalProvider>
            <ErrorBoundary>{/* your screens */}</ErrorBoundary>
          </PortalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
```

With Expo Router, the same wrapping goes in `app/_layout.tsx` — see [`apps/example/app/_layout.tsx`](./apps/example/app/_layout.tsx).

---

## The Layout Intelligence Layer

The LIL is the core innovation. Every behavior is a typed function of its inputs — same children + same parent context = same output, always. Full rule list with test references is in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md).

### Slot / `asChild`

Radix-style prop-merging slot. `<Slot {...parentProps}><Child /></Slot>` returns the child with merged props instead of an extra wrapping View.

```tsx
import { Slot } from '@mindees/ui';
import { Pressable, Text } from 'react-native';

<Slot accessibilityRole="button" onPress={parentHandler}>
  <Pressable onPress={childHandler}>
    <Text>Press me</Text>
  </Pressable>
</Slot>;
```

| Prop family          | Merge rule                                                               |
| -------------------- | ------------------------------------------------------------------------ |
| `onX` event handlers | child first, then parent (parent skipped if `evt.defaultPrevented`)      |
| `style`              | array (`[parentStyle, childStyle]`); RN flattens, child wins on conflict |
| `className` (web)    | concatenated                                                             |
| `ref`                | both forwarded via `mergeRefs`                                           |
| any other prop       | child wins (an explicit child override beats the slot's default)         |

Use `AsChildProps<DefaultProps>` to type a component that accepts `asChild`:

```tsx
import { Slot, type AsChildProps } from '@mindees/ui';
import { Pressable, type PressableProps } from 'react-native';

type ButtonProps = AsChildProps<PressableProps>;

function Button(props: ButtonProps) {
  const Comp = props.asChild ? Slot : Pressable;
  return <Comp {...props} />;
}
```

### Tagged components & child introspection

Every MindeesUI component carries a `Symbol.for('@mindees/ui:component-tag')` so parents can identify children even across module realms. Use `tagComponent` when building your own and the parent will see them as first-class participants.

```tsx
import { tagComponent, describeChildren } from '@mindees/ui';

const MyButton = tagComponent(function MyButton() {
  /* ... */
}, 'Button');

function MyToolbar({ children }: { children: React.ReactNode }) {
  const slots = describeChildren(children);
  // slots = [{ element, tag: 'Button', index, isFirst, isLast }, ...]
  return /* render with corner-merging etc. */;
}
```

### Intrinsic sizing

`width` and `height` accept `IntrinsicSize = 'fill' | 'hug' | number | \`${number}%\``:

| Input   | Maps to                                        |
| ------- | ---------------------------------------------- |
| `fill`  | `{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }` |
| `hug`   | `{ flexShrink: 0 }` (intrinsic content size)   |
| number  | `width: N` or `height: N`                      |
| `${N}%` | `width: 'N%'` or `height: 'N%'`                |

```ts
import { resolveSizeProps } from '@mindees/ui';
const style = resolveSizeProps({ width: 'fill', height: 'hug', minHeight: 44 });
```

### Auto-spacing rules

`Stack` / `HStack` / `VStack` use a `gap` token, then adjust per consecutive pair (`prev`, `next`) using a deterministic rule:

| Rule      | Multiplier | Triggered by                                                     |
| --------- | ---------- | ---------------------------------------------------------------- |
| `tighter` | × 0.25     | Heading↔Caption/Label (eyebrow text)                             |
| `tight`   | × 0.5      | Text→Text (continuous prose)                                     |
| `base`    | × 1        | anything else                                                    |
| `loose`   | × 1.5      | Heading→Text (hierarchy break); content→Button (trailing action) |
| `looser`  | × 2        | (reserved for section breaks)                                    |

```ts
import { resolveGapRule, resolveGapToken } from '@mindees/ui';

const rule = resolveGapRule('Heading', 'Text'); // 'loose'
const gap = resolveGapToken('md', rule); // 24  (16 × 1.5)
```

### Specialised parent–child contexts

Each compound parent publishes a typed context describing exactly what its children need. Children read whichever apply.

| Context              | Provided by               | Read by                                                      |
| -------------------- | ------------------------- | ------------------------------------------------------------ |
| `ButtonGroupContext` | `ButtonGroup`             | `Button`, `IconButton` (corner-merging, size sync)           |
| `ListContext`        | `List`                    | `ListItem` (density, dividers)                               |
| `StackContext`       | `Stack`/`HStack`/`VStack` | direct children (axis-aware spacing)                         |
| `FormFieldContext`   | `FormField`               | `Input`, `Label`, `HelperText`, `ErrorMessage` (a11y wiring) |
| `CardContext`        | `Card`                    | `Card.Header`, `Card.Body`, `Card.Footer`                    |

A component without a wrapping parent falls back to sensible defaults — no errors, no missing-context throws.

---

## Theming

### `ThemeProvider`

Wrap your app with `<ThemeProvider>` to enable theming, system listeners (color scheme, reduce-motion, high-contrast), and theme switching.

```tsx
import { ThemeProvider } from '@mindees/ui';

<ThemeProvider mode="auto">
  {' '}
  {/* 'auto' | 'light' | 'dark' */}
  {/* your app */}
</ThemeProvider>;
```

Props:

| Prop                | Type                          | Default                  | Description                                          |
| ------------------- | ----------------------------- | ------------------------ | ---------------------------------------------------- |
| `mode`              | `'auto' \| 'light' \| 'dark'` | `'auto'`                 | `auto` follows the OS; otherwise pinned              |
| `light`             | `Theme`                       | `lightTheme`             | theme used in light mode                             |
| `dark`              | `Theme`                       | `darkTheme`              | theme used in dark mode                              |
| `highContrastLight` | `Theme`                       | `highContrastLightTheme` | used when the OS reports high-contrast mode in light |
| `highContrastDark`  | `Theme`                       | `highContrastDarkTheme`  | likewise in dark                                     |

### `createTheme`

Build a theme from tokens + overrides:

```ts
import { createTheme } from '@mindees/ui';

export const brandTheme = createTheme({
  name: 'brand',
  colorScheme: 'light',
  contrast: 'normal', // or 'high'
  density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
  colors: {
    action: { primary: '#ff00aa', primaryHover: '#e6009a' },
  },
});
```

Four themes ship by default: `lightTheme`, `darkTheme`, `highContrastLightTheme`, `highContrastDarkTheme`.

### Theming hooks

```tsx
import { useTheme, useTokens, useReduceMotion } from '@mindees/ui';

function MyView() {
  const theme = useTheme(); // current Theme object
  const t = useTokens(); // shorthand for theme.tokens
  const reduceMotion = useReduceMotion();
  return (
    <View
      style={{
        padding: t.space.lg,
        backgroundColor: t.colors.background.canvas,
        borderRadius: t.radii.md,
      }}
    />
  );
}
```

Used outside a `<ThemeProvider>`, hooks return `lightTheme` — keeps Storybook stories renderable without setup.

---

## Providers

### `PortalProvider` + `Portal`

Lightweight, dependency-free portals with named z-ordered hosts.

```tsx
import { PortalProvider, Portal } from '@mindees/ui';

// near the root
<PortalProvider hosts={['modal', 'bottom-sheet', 'popover', 'tooltip', 'toast']}>
  {/* app */}
</PortalProvider>

// anywhere in the tree
<Portal host="modal">
  <View>...</View>
</Portal>
```

The default hosts cover the standard overlay types. Custom hosts can be added by passing your own array to `<PortalProvider hosts={[...]}>`.

### `ErrorBoundary`

Class-based error boundary with a retry callback. Catches render-time errors below it and offers a customisable fallback.

```tsx
import { ErrorBoundary } from '@mindees/ui';

<ErrorBoundary
  onError={(error, info) => logToService(error, info)}
  fallback={(error, retry) => (
    <View>
      <Text>{error.message}</Text>
      <Button onPress={retry}>Try again</Button>
    </View>
  )}
>
  {/* tree */}
</ErrorBoundary>;
```

---

## Accessibility

- WCAG 2.2 AA roles, labels, focus order
- `useReduceMotion()` gates every animation
- Dynamic Type / font scaling honoured
- Full RTL — layout primitives use logical edges (`start` / `end`) not `left` / `right`
- Auto-wiring through `FormFieldContext` for inputs / labels / errors
- High-contrast themes ship out of the box and engage on `prefers-contrast` automatically
- Native haptics via `expo-haptics` when present, gracefully no-op when not

See [accessibility notes per component](./docs/ARCHITECTURE.md#accessibility-auto-wiring).

## Performance

CI-enforced budgets, not vibes:

- **TypeScript strict** with `any` blocked in public API by ESLint
- **Test coverage gate** in CI (Phase 1: 50%+, ramping to 90% as components ship)
- **Reassure** render-perf regression on every PR (>10% slowdown blocks merge)
- **Flashlight** runtime fps verification on a low-end Android target before each release
- **Per-subpath bundle budgets** enforced by [`scripts/check-bundle-budget.mjs`](./scripts/check-bundle-budget.mjs)
- **Version drift** caught by [`scripts/verify-versions.mjs`](./scripts/verify-versions.mjs)

Details in [`docs/PERFORMANCE.md`](./docs/PERFORMANCE.md).

---

## What's in the box (component status)

| Layer                                                      | Status                   | Highlights                                                                                                                                           |
| ---------------------------------------------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Design tokens** ([`@mindees/tokens`](./packages/tokens)) | ✅ shipped               | colour scales (semantic + high-contrast), modular type scale, 4-point spacing, radii, shadows (iOS + Android), motion, breakpoints, z-index, density |
| **Layout Intelligence Layer**                              | ✅ shipped               | `Slot` / `asChild`, child introspection, intrinsic sizing, auto-spacing rules, specialised contexts                                                  |
| **Theming & providers**                                    | ✅ shipped               | `ThemeProvider` + system listeners, `createTheme`, `PortalProvider` + `Portal`, `ErrorBoundary`                                                      |
| **Icons** ([`@mindees/icons`](./packages/icons))           | ✅ shipped (starter set) | `createIcon` factory + 7 starter glyphs; full set lands in Phase 6                                                                                   |
| **Layout & Typography primitives**                         | 🚧 Phase 2               | `Box`, `Stack`/`HStack`/`VStack`/`ZStack`, `Grid`, `Divider`, `Spacer`, `SafeAreaView`, `Text`, `Heading`, `Caption`, `Label`, `Link`, `Code`, `Kbd` |
| **Forms & Inputs**                                         | 🚧 Phase 3               | `Input`, `Textarea`, `Select`, `Checkbox`, `Radio`, `Switch`, `Slider`, `DatePicker`, `OTPInput`, `PhoneInput`, `FileUpload`                         |
| **Buttons & Overlays**                                     | 🚧 Phase 4               | `Button`, `IconButton`, `FAB`, `ButtonGroup`, `Modal`, `BottomSheet`, `Toast`, `Tooltip`, `Popover`, `Drawer`, `Alert`, `ActionSheet`                |
| **Navigation, Display & Data**                             | 🚧 Phase 5               | `Tabs`, `Card`, `Avatar`, `Badge`, `Image`, `Icon`, `List`, `Accordion`, `Progress`, `Skeleton`, `Stepper`, `Calendar`                               |
| **Specialised**                                            | 🚧 Phase 6               | `QRCode`, `Barcode`, `MapView`, `CodeBlock`, `ColorPicker`, `SignaturePad`, `WebView`, `Camera` (gated peers + fallbacks)                            |

Full roadmap with current progress: [`docs/ROADMAP.md`](./docs/ROADMAP.md).

## Comparison with alternatives

|                                          | MindeesUI | NativeBase | Tamagui    | Gluestack UI |
| ---------------------------------------- | --------- | ---------- | ---------- | ------------ |
| Deterministic Layout Intelligence Layer  | ✅        | —          | —          | —            |
| New Architecture only (Fabric / JSI)     | ✅        | partial    | ✅         | ✅           |
| Unistyles v3 (Nitro, zero re-renders)    | ✅        | —          | own engine | own engine   |
| Compound components + `Slot` / `asChild` | ✅        | partial    | ✅         | ✅           |
| Tree-shakeable subpath exports           | ✅        | partial    | ✅         | ✅           |
| Built-in tokens + high-contrast theme    | ✅        | partial    | ✅         | partial      |
| MIT licence                              | ✅        | ✅         | MIT        | MIT          |
| React Native Web                         | ✅        | ✅         | ✅         | ✅           |
| TS strict, no `any` in public API        | ✅        | partial    | partial    | partial      |

---

## FAQ

<details>
<summary><b>What is MindeesUI?</b></summary>

MindeesUI is an open-source **React Native UI component library** for **Expo** and bare React Native CLI apps. It bundles a design system, accessibility-first components, theming, and a **deterministic Layout Intelligence Layer** that auto-derives correct spacing, sizing, alignment, and accessibility props from the shape of your JSX tree.

</details>

<details>
<summary><b>Why is it "universal"?</b></summary>

The same components render on iOS, Android, and the web (via React Native Web). Component primitives are written against React Native's API; platform-specific behaviour (haptics, blur, splash) is gated behind optional peers and gracefully no-ops when not present.

</details>

<details>
<summary><b>Does it work with Expo Router?</b></summary>

Yes. The example app uses `expo-router` v56 with the root layout wrapped in `ThemeProvider` / `PortalProvider` / `ErrorBoundary`. See [`apps/example/app/_layout.tsx`](./apps/example/app/_layout.tsx).

</details>

<details>
<summary><b>What's the difference between MindeesUI and Tamagui / NativeBase / Gluestack?</b></summary>

The **Layout Intelligence Layer** — components reading their children and adjusting themselves, _deterministically and documented_. The other libraries require manual spacing/sizing/alignment props for every component. Plus MindeesUI is New-Arch-only, uses Unistyles v3 (Nitro modules) for zero-re-render theming, and ships a CI-enforced bundle budget per subpath.

</details>

<details>
<summary><b>Does it support React Native Web?</b></summary>

Yes, where the underlying primitives support web rendering. Native-only components (camera, signature pad, biometrics) are gated behind optional peers.

</details>

<details>
<summary><b>Is it accessible?</b></summary>

Yes — every component ships with **WCAG 2.2 AA** roles and labels, `prefers-reduced-motion` is honoured by every animation, **Dynamic Type** scales typography, **RTL** layouts are correct, and high-contrast themes are built in.

</details>

<details>
<summary><b>Will it support the old (Paper) React Native architecture?</b></summary>

No. MindeesUI is **New Architecture only** (Fabric + JSI + TurboModules + Bridgeless). The old bridge has fundamental performance and ergonomics limitations the library relies on the new architecture to avoid.

</details>

<details>
<summary><b>How do I build a custom theme?</b></summary>

```ts
import { createTheme, ThemeProvider } from '@mindees/ui';

const brandTheme = createTheme({
  name: 'brand',
  colorScheme: 'light',
  colors: { action: { primary: '#ff00aa' } },
});

<ThemeProvider mode="light" light={brandTheme}>{/* app */}</ThemeProvider>
```

</details>

<details>
<summary><b>Where are tests / coverage / a11y reports?</b></summary>

In CI on every PR. Local: `pnpm test`, `pnpm test:coverage`, `pnpm test:perf`. The example app drives manual screen-reader checks.

</details>

---

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
├─ scripts/      verify-versions, check-bundle-budget
└─ .github/      CI matrix, PR template, release workflow
```

## Contributing

PRs and issues welcome. Every PR runs the full quality gate: typecheck, lint, format, tests with coverage, build, bundle-budget, perf regression. Setup is in [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md).

```sh
git clone https://github.com/mindees/mindees-ui.git
cd mindees-ui
pnpm install
pnpm typecheck && pnpm lint && pnpm test && pnpm build
pnpm example start    # boot the Expo kitchen-sink
pnpm docs dev         # boot the docs site
```

When you change a published package, run `pnpm changeset` to describe the bump. Merging to `main` triggers a "Version Packages" PR; merging that publishes via Changesets.

## Sponsors & acknowledgements

MindeesUI builds on the shoulders of an outstanding open-source community: **React Native**, **Expo**, **Reanimated**, **Gesture Handler**, **Unistyles**, **FlashList**, **react-native-svg**, **Fumadocs**, **Turborepo**, **Changesets**, **Radix UI** (Slot pattern inspiration), and many more. Thank you.

## License

[MIT](./LICENSE) © 2026 MindeesUI contributors

<p align="center">
  <sub>Built for the <a href="https://reactnative.dev/blog">React Native New Architecture</a> · Designed in the open at <a href="https://github.com/mindees">github.com/mindees</a></sub>
</p>

---

<details>
<summary><b>Keywords</b> (for npm + Google search)</summary>

react-native · expo · expo-sdk-56 · expo-sdk-55 · react-native-new-architecture · fabric · jsi · turbomodules · ui-library · component-library · design-system · react-native-ui-kit · react-native-components · cross-platform-ui · universal-react-native · ios · android · react-native-web · typescript · strict-types · unistyles · react-native-unistyles · react-native-reanimated · flash-list · accessibility · wcag · a11y · rtl · dynamic-type · prefers-reduced-motion · dark-mode · high-contrast · design-tokens · theming · layout-intelligence · radix · slot · as-child · compound-components · child-introspection · intrinsic-sizing · auto-spacing · mobile-ui · react-native-design-system · expo-router · react-19 · new-arch · bridgeless · turbo · turborepo · pnpm · monorepo · changesets · jest · react-native-testing-library · storybook · reassure · flashlight

</details>
