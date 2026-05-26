# MindeesUI

> Universal React Native CLI + Expo component library with a deterministic **Layout Intelligence Layer**. Drop children in; correct spacing, sizing, alignment, roles, and styling fall out automatically — and you can override every heuristic.

[![CI](https://img.shields.io/github/actions/workflow/status/mindees/mindees-ui/ci.yml?branch=main&label=CI)](https://github.com/mindees/mindees-ui/actions)
[![npm](https://img.shields.io/npm/v/@mindees/ui?label=%40mindees%2Fui)](https://www.npmjs.com/package/@mindees/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

## Status

This repository is **in active early development** (Phase 0–1 of 8). Read [`docs/ROADMAP.md`](./docs/ROADMAP.md) for an honest view of what's done, in progress, and not yet started. The public API is unstable until v1.0.0.

## What makes it different

A **deterministic Layout Intelligence Layer**. Compound components, a Slot/`asChild` pattern, and child introspection let parents adjust their children without runtime magic:

- a `Button` inside a `ButtonGroup` auto-merges borders and rounds outer corners
- an `Icon` inside a `Button` inherits size + colour + spacing from the button's variant
- a `ListItem` inside a `List` inherits dividers and density
- `Stack`/`HStack`/`VStack` apply child-type-aware gaps (heading→body is larger than body→body) using design tokens, not raw numbers
- intrinsic `fill | hug | fixed` sizing resolves to deterministic flex rules
- accessibility roles, labels, and grouping are inferred from structure and overridable

Every heuristic is documented in [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md), covered by unit tests, and overridable by explicit props.

## Compatibility

- **Expo SDK 55 and 56** (RN 0.83 and 0.85)
- **React 19.1+**
- **New Architecture only** (Fabric + JSI + TurboModules + Bridgeless)
- iOS 15.1+, Android API 24+, React Native Web where feasible

Full peer-dependency matrix in [`docs/COMPATIBILITY.md`](./docs/COMPATIBILITY.md).

## Install (when published)

```sh
# pnpm
pnpm add @mindees/ui @mindees/tokens @mindees/icons

# yarn
yarn add @mindees/ui @mindees/tokens @mindees/icons

# npm
npm install @mindees/ui @mindees/tokens @mindees/icons
```

Peer dependencies (install if you don't already have them):

```sh
pnpm add react-native-reanimated react-native-gesture-handler \
  react-native-unistyles react-native-nitro-modules react-native-edge-to-edge \
  react-native-safe-area-context react-native-svg @shopify/flash-list
```

## Quickstart

```tsx
import { ThemeProvider, PortalProvider, Stack, Button, Heading, Text } from '@mindees/ui';

export default function App() {
  return (
    <ThemeProvider theme="auto">
      <PortalProvider>
        <Stack padding="lg" gap="md">
          <Heading>Hello, MindeesUI</Heading>
          <Text tone="muted">
            Drop children in — the Layout Intelligence Layer handles the rest.
          </Text>
          <Button variant="primary" onPress={() => {}}>
            Get started
          </Button>
        </Stack>
      </PortalProvider>
    </ThemeProvider>
  );
}
```

## Honest scope notes

The original spec asked for "no errors", "100% performance", "ranked #1 on Google", and "something never done before". Those are unverifiable claims, so we translated each into a measurable engineering condition. See the Honesty Clause in [`docs/ROADMAP.md`](./docs/ROADMAP.md#honesty-clause).

## Repository layout

```
packages/
  core/      # @mindees/ui — the library
  tokens/    # @mindees/tokens — design tokens
  icons/     # @mindees/icons — icon set wrapper
apps/
  example/   # Expo + bare-compatible kitchen-sink app
  docs/      # Next.js + Fumadocs documentation site
.storybook/  # cross-platform component catalogue
docs/        # COMPATIBILITY, ARCHITECTURE, ROADMAP, CONTRIBUTING, PERFORMANCE
```

## Contributing

See [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md). Pull requests run the full quality gate before merge: typecheck, lint, unit + a11y tests, Reassure perf regression, build, and changeset check.

## License

[MIT](./LICENSE) © 2026 MindeesUI contributors
