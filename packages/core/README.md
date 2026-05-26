<p align="center">
  <a href="https://mindees.dev">
    <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI — universal React Native and Expo component library with a deterministic Layout Intelligence Layer" width="160" height="160" />
  </a>
</p>

<h1 align="center">@mindees/ui</h1>

<p align="center">
  <b>The universal React Native + Expo UI component library</b> for the New Architecture.<br/>
  ~60 components. A deterministic <b>Layout Intelligence Layer</b>. iOS, Android, React Native Web.
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

- 🧠 **Deterministic Layout Intelligence Layer** — compound components, Radix-style `Slot` / `asChild`, child introspection, auto-spacing, intrinsic sizing, parent–child contexts.
- 📱 **Universal React Native + Expo + React Native Web** — one codebase ships to iOS, Android, and the web from Expo SDK 55 or 56.
- ⚡ **New Architecture only** — Fabric + JSI + TurboModules + Bridgeless. No legacy bridge overhead.
- 🚀 **60 / 120 fps by design** — `react-native-reanimated` v4 worklets, `@shopify/flash-list` for long lists, `react-native-unistyles` v3 Nitro-powered styling.
- ♿ **Accessibility-first** — WCAG 2.2 AA, screen reader labels, `prefers-reduced-motion`, Dynamic Type, full RTL, native haptics.
- 🎨 **Design tokens & theming** — light, dark, and high-contrast themes out of the box. `createTheme` for fully custom brand themes.
- 🧪 **Tested** — Jest + React Native Testing Library, Reassure perf-regression on every PR.
- 🪶 **Tree-shakeable** — `sideEffects: false`, subpath exports per component.
- 🧠 **TypeScript strict** — zero `any` in the public API.

## Install

```sh
pnpm add @mindees/ui @mindees/tokens @mindees/icons

# New-Architecture peers
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-svg @shopify/flash-list
```

`npm` and `yarn` work too.

## Quickstart

```tsx
import {
  ThemeProvider,
  PortalProvider,
  ErrorBoundary,
  configureUnistyles,
  ScreenWrapper,
  Stack,
  Heading,
  Text,
  Button,
  FormField,
  Input,
  Card,
} from '@mindees/ui';

configureUnistyles();

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <PortalProvider>
        <ErrorBoundary>
          <ScreenWrapper padding="lg" scroll avoidKeyboard>
            <Stack gap="md">
              <Heading level={1}>Welcome back</Heading>
              <Text tone="muted">Sign in to continue.</Text>
              <Card variant="outlined">
                <Stack gap="md">
                  <FormField label="Email" required>
                    <Input keyboardType="email-address" autoCapitalize="none" />
                  </FormField>
                  <FormField label="Password" required>
                    <Input secureTextEntry />
                  </FormField>
                  <Button variant="primary" fullWidth>
                    Sign in
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </ScreenWrapper>
        </ErrorBoundary>
      </PortalProvider>
    </ThemeProvider>
  );
}
```

## What's in the box (~60 components)

| Domain                                              | Components                                                                                                                                                                                                                                                     |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Layout**                                          | `Box`, `Stack`, `HStack`, `VStack`, `ZStack`, `Grid`, `Divider`, `Spacer`, `SafeAreaView`, `ScreenWrapper`                                                                                                                                                     |
| **Typography**                                      | `Text`, `Heading`, `Caption`, `Label`, `Link`, `Code`, `Kbd`                                                                                                                                                                                                   |
| **Forms**                                           | `FormField`, `Input`, `Textarea`, `PasswordInput`, `SearchInput`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`                                                                                                                                 |
| **Buttons**                                         | `Button`, `IconButton`, `FAB`, `ButtonGroup`                                                                                                                                                                                                                   |
| **Overlays**                                        | `Modal`, `BottomSheet`, `Toast`, `Tooltip`, `Popover`, `Drawer`, `Alert`, `ActionSheet`                                                                                                                                                                        |
| **Navigation**                                      | `Tabs`, **`PillTabBar`** (2026 style — segmented / floating / dock / glass variants), `TopBar`, `Breadcrumb`, `Pagination`, `Stepper`                                                                                                                          |
| **Display & Data**                                  | `Card`, `Avatar`, `AvatarGroup`, `Badge`, `Tag`, `Chip`, `Image`, `List`, `ListItem`, `Accordion`, `Progress`, `Skeleton`, `Spinner`, `Stat`, `Rating`, `Timeline`                                                                                             |
| **Specialised** (optional peers, graceful fallback) | `CodeBlock`, `ColorPicker` (zero-deps), `QRCode`, `Barcode`, `MapView`, `SignaturePad`, `WebView`, `Camera`                                                                                                                                                    |
| **Foundations**                                     | `ThemeProvider`, `PortalProvider`, `Portal`, `ErrorBoundary`, `configureUnistyles`, `createStyles`, `useResponsive`, `useTheme`, `useTokens`, `useReduceMotion`, `useUniqueId`, `useAnnouncer`, `useFormFieldA11y`, `Slot`, `tagComponent`, `describeChildren` |

## 2026-style `PillTabBar`

Four variants you can drop in:

```tsx
import { PillTabBar } from '@mindees/ui';

<PillTabBar
  variant="segmented" // 'segmented' | 'floating' | 'dock' | 'glass'
  items={[
    { value: 'feed', label: 'Feed' },
    { value: 'search', label: 'Search' },
    { value: 'me', label: 'Me' },
  ]}
  value={tab}
  onValueChange={setTab}
/>;
```

| Variant     | Look                                                                       |
| ----------- | -------------------------------------------------------------------------- |
| `segmented` | Apple-style segmented control with a sliding pill behind the active tab    |
| `floating`  | Material-You-ish capsule container; active item gets a solid pill          |
| `dock`      | Bottom-navigation dock; active item gets a coloured pill with icon + label |
| `glass`     | Translucent floating bar with a soft border + shadow                       |

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

|                                             | MindeesUI | NativeBase | Tamagui    | Gluestack UI |
| ------------------------------------------- | --------- | ---------- | ---------- | ------------ |
| Deterministic Layout Intelligence Layer     | ✅        | —          | —          | —            |
| New Architecture only (Fabric / JSI)        | ✅        | partial    | ✅         | ✅           |
| Unistyles v3 (Nitro, zero re-renders)       | ✅        | —          | own engine | own engine   |
| Compound components + Slot / asChild        | ✅        | partial    | ✅         | ✅           |
| Tree-shakeable subpath exports              | ✅        | partial    | ✅         | ✅           |
| Built-in tokens + high-contrast theme       | ✅        | partial    | ✅         | partial      |
| 2026-style pill TabBar variants             | ✅        | —          | —          | —            |
| Gated specialised peers (QR, Map, WebView…) | ✅        | partial    | —          | —            |
| MIT licence                                 | ✅        | ✅         | MIT        | MIT          |

## FAQ

### What is MindeesUI?

Open-source **React Native UI component library** for **Expo** and bare React Native CLI. Bundles a design system, accessibility-first components, theming, and a deterministic Layout Intelligence Layer.

### Does it work with Expo Router?

Yes. Wrap the root layout in `ThemeProvider` / `PortalProvider` / `ErrorBoundary`. See the example app.

### Does it support React Native Web?

Yes, where the underlying primitives support web rendering. Native-only specialised components (camera, signature pad) are gated behind optional peers.

### Is it accessible?

Yes — every component ships with **WCAG 2.2 AA** roles and labels, `prefers-reduced-motion` honoured, **Dynamic Type** scaled typography, **RTL** layouts correct, and high-contrast themes built in.

### Will it support the old (Paper) React Native architecture?

No. **New Architecture only.**

### Custom theme?

```ts
import { createTheme } from '@mindees/ui';
const brand = createTheme({
  name: 'brand',
  colorScheme: 'light',
  colors: { action: { primary: '#ff00aa' } },
});
```

## Documentation

- [Getting Started](https://mindees.dev/docs)
- [Installation](https://mindees.dev/docs/installation)
- [Architecture & Layout Intelligence Layer](https://mindees.dev/docs/architecture)
- [Theming](https://mindees.dev/docs/theming)
- [Providers](https://mindees.dev/docs/providers)
- [Compatibility Matrix](https://github.com/mindees/mindees-ui/blob/main/docs/COMPATIBILITY.md)
- [Performance Budgets](https://github.com/mindees/mindees-ui/blob/main/docs/PERFORMANCE.md)
- [Contributing](https://github.com/mindees/mindees-ui/blob/main/docs/CONTRIBUTING.md)
- [Roadmap](https://github.com/mindees/mindees-ui/blob/main/docs/ROADMAP.md)

## License

[MIT](https://github.com/mindees/mindees-ui/blob/main/LICENSE) © 2026 MindeesUI contributors

---

<details>
<summary><b>Keywords</b> (for npm + Google search)</summary>

react-native · expo · expo-sdk-56 · expo-sdk-55 · react-native-new-architecture · fabric · react-native-fabric · react-native-jsi · turbomodules · bridgeless · ui-library · component-library · design-system · react-native-ui-kit · react-native-components · cross-platform-ui · universal-react-native · ios · android · react-native-web · typescript · strict-types · unistyles · react-native-unistyles · react-native-reanimated · flash-list · accessibility · wcag · a11y · rtl · dynamic-type · prefers-reduced-motion · dark-mode · high-contrast · design-tokens · theming · layout-intelligence · radix · slot · as-child · compound-components · child-introspection · intrinsic-sizing · auto-spacing · pill-tab-bar · tab-bar · bottom-navigation · 2026-style · mobile-ui · react-native-design-system · expo-router · react-19 · new-arch

</details>
