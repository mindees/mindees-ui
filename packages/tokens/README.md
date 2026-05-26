<p align="center">
  <a href="https://mindees.dev">
    <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI — design tokens for React Native and Expo" width="120" height="120" />
  </a>
</p>

<h1 align="center">@mindees/tokens</h1>

<p align="center">
  <b>Design tokens for React Native and Expo</b> — colour scales, semantic mappings, typography, spacing, radii, shadows, motion, breakpoints, z-index, and density. The foundation of <a href="https://www.npmjs.com/package/@mindees/ui">@mindees/ui</a>, usable on its own.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mindees/tokens"><img src="https://img.shields.io/npm/v/@mindees/tokens?label=%40mindees%2Ftokens&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/tokens"><img src="https://img.shields.io/npm/dm/@mindees/tokens?label=downloads&logo=npm" alt="downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/tokens"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/tokens?label=size" alt="bundle size" /></a>
  <a href="https://github.com/mindees/mindees-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT license" /></a>
</p>

---

## Why design tokens?

Hardcoding `padding: 16` everywhere is the express train to inconsistent layouts and broken theme switches. **Design tokens** are a named, single source of truth for the visual primitives in your design system: spacing, colour, typography, shadows, motion. Switch a theme by swapping tokens — no component changes.

`@mindees/tokens` ships a complete, framework-agnostic token set sized for React Native + Expo + React Native Web apps, plus high-contrast variants for accessibility.

## Features

- 🎨 **Colour** — 12-step scales (Radix-inspired) for gray, blue, green, red, yellow, orange in light _and_ dark, plus semantic mappings (`background.canvas`, `text.primary`, `action.primary`, `status.success`, etc.) and high-contrast variants.
- 🔤 **Typography** — modular type scale (`2xs`–`6xl`), line heights, weights, letter spacing, platform default font stacks (SF Pro on iOS, Roboto on Android, system-ui on web), plus named text styles (`display`, `h1`–`h6`, `body`, `label`, `caption`, `overline`, `code`).
- 📐 **Spacing** — 4-point scale (`none`, `3xs`, `2xs`, `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`).
- 🟦 **Radii** — `none` through `3xl` and `pill` / `full`.
- 🌑 **Shadows** — iOS shadow props _and_ Android elevation in one resolver; works cross-platform.
- ⏱️ **Motion** — Doherty-Threshold-aware durations (`fastest`–`slowest`) and named easings (`standard`, `emphasised`, `bounce`, …).
- 📱 **Breakpoints** — `xs`–`2xl` for container-aware responsive layouts.
- 🪜 **Z-index** — named layers (`dropdown`, `drawer`, `overlay`, `modal`, `popover`, `toast`, `tooltip`) so overlays never collide.
- 🔘 **Density** — `compact` / `comfortable` / `spacious` modes that scale spacing + touch targets without changing the design language.
- 🪶 **Tree-shakeable** — subpath exports per token category, `sideEffects: false`.
- 🧠 **TypeScript-strict** — every export is `as const`, fully typed, immutable.

## Install

```sh
pnpm add @mindees/tokens
# or
npm install @mindees/tokens
# or
yarn add @mindees/tokens
```

You'll typically install it alongside the main library:

```sh
pnpm add @mindees/ui @mindees/tokens @mindees/icons
```

## Quickstart

```ts
import {
  semanticLight,
  semanticDark,
  space,
  radii,
  shadows,
  textStyles,
  duration,
  easing,
  breakpoints,
  zIndex,
} from '@mindees/tokens';

const cardStyle = {
  padding: space.lg, // 20
  backgroundColor: semanticLight.background.surface,
  borderRadius: radii.md, // 8
  ...shadows.md,
};
```

Or via subpath imports for the smallest possible bundle:

```ts
import { space } from '@mindees/tokens/spacing';
import { radii } from '@mindees/tokens/radii';
import { semanticLight } from '@mindees/tokens/color';
```

## API reference

### Colour

#### Raw scales

12-step ramps in light _and_ dark for: `gray`, `blue`, `green`, `red`, `yellow`, `orange`. Step 1 = subtle background; 12 = highest-contrast text. Steps 8/9 are the accent.

```ts
import { lightPalette, darkPalette, grayLight, blueLight } from '@mindees/tokens/color';

console.log(grayLight[0]); // '#fcfcfc' — app background
console.log(grayLight[11]); // '#202020' — body text
console.log(blueLight[8]); // '#0090ff' — accent
```

#### Semantic mappings

These are the colours your components should use. Switching a theme swaps the semantic values; the component code never changes.

```ts
import { semanticLight, semanticDark, type SemanticColors } from '@mindees/tokens/color';

semanticLight.background.canvas; // '#fcfcfc'
semanticLight.text.primary; // '#202020'
semanticLight.action.primary; // '#0090ff'
semanticLight.status.success; // green[8]
semanticLight.overlay.scrim; // 'rgba(0,0,0,0.42)'
```

Categories: `background`, `text`, `border`, `action`, `status`, `overlay`.

#### High-contrast variants

```ts
import { semanticHighContrastLight, semanticHighContrastDark } from '@mindees/tokens/color';
```

WCAG 2.2 AAA-level contrast for users with `prefers-contrast: more`.

### Typography

```ts
import {
  textStyles,
  fontSize,
  fontWeight,
  lineHeight,
  systemFont,
} from '@mindees/tokens/typography';

textStyles.h1; // { size: 36, lineHeight: 49, weight: '700', letterSpacing: -0.4 }
textStyles.body; // { size: 16, lineHeight: 24, weight: '400', letterSpacing: 0 }
textStyles.caption; // { size: 12, lineHeight: 16, weight: '400', letterSpacing: 0 }

fontSize.md; // 16
fontWeight.semibold; // '600'
systemFont; // 'System' (iOS) / 'sans-serif' (Android) / system-ui stack (web)
```

Named text styles: `display`, `h1`–`h6`, `bodyLg`/`body`/`bodySm`, `label`/`labelLg`, `caption`, `overline`, `code`.

### Spacing

```ts
import { space, minTouchTarget } from '@mindees/tokens/spacing';

space.md; // 16
space['2xl']; // 32
minTouchTarget.cozy; // 44 — Fitts's-Law-safe default button height
```

### Radii

```ts
import { radii } from '@mindees/tokens/radii';

radii.sm; // 4
radii.md; // 8
radii.pill; // 9999
```

### Shadows

```ts
import { shadows, resolveShadow } from '@mindees/tokens/shadows';

// Direct spec
shadows.md;  // { shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation }

// Platform-resolved (iOS shadow* / Android elevation)
<View style={[resolveShadow('md'), /* ... */]} />
```

### Motion

```ts
import { duration, easing } from '@mindees/tokens/motion';

duration.fast; // 150  (Doherty Threshold safe)
duration.base; // 220
easing.standard; // [0.2, 0, 0, 1]
easing.emphasised; // [0.3, 0, 0, 1]
```

### Breakpoints

```ts
import {
  breakpoints,
  type ResponsiveValue,
  type BreakpointToken,
} from '@mindees/tokens/breakpoints';

breakpoints.md; // 600
breakpoints.lg; // 900

// ResponsiveValue<T> = T | Partial<Record<BreakpointToken, T>>
const padding: ResponsiveValue<keyof typeof space> = { xs: 'sm', md: 'lg' };
```

### Z-index

```ts
import { zIndex } from '@mindees/tokens/z-index';

zIndex.modal; // 1400
zIndex.tooltip; // 1700
```

### Density

```ts
import { densityScales, type DensityMode } from '@mindees/tokens/density';

densityScales.compact; // { spaceMultiplier: 0.85, touchTarget: 'dense', ... }
densityScales.spacious; // { spaceMultiplier: 1.2,  touchTarget: 'comfortable', ... }
```

## Compatibility

Same as `@mindees/ui`: Expo SDK 55 / 56 (RN 0.83 / 0.85), React 19.1+, New Architecture only. Tokens are framework-agnostic at heart, but `shadows` and `typography` use React Native's `Platform` API so the package declares `react-native` as a peer dependency.

## Why not just CSS variables?

CSS variables work on the web but not in native React Native (which has its own style system). MindeesUI tokens are typed TypeScript values — usable in StyleSheet objects, Unistyles, NativeWind, Tamagui's `createTokens`, your own theme system, or just plain inline styles.

## License

[MIT](https://github.com/mindees/mindees-ui/blob/main/LICENSE) © 2026 MindeesUI contributors

---

<details>
<summary><b>Keywords</b> (for npm + Google search)</summary>

design-tokens · react-native-design-tokens · expo-design-tokens · color-scales · semantic-colors · radix-colors · high-contrast · accessibility · wcag · typography-scale · modular-scale · spacing-scale · 4-point-grid · radii · border-radius · shadow-tokens · cross-platform-shadows · ios-shadow · android-elevation · motion-tokens · easing-curves · doherty-threshold · breakpoints · responsive · z-index · stacking-context · density-modes · theming · dark-mode · light-mode · brand-themes · react-native · expo · typescript · strict-types · tree-shakeable · subpath-exports · side-effects-false · mindees-ui

</details>
