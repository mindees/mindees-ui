# Performance

We don't claim "100% optimized". We claim measurable budgets that CI enforces, with a method for finding regressions before they ship.

## Budgets (CI-enforced)

### Bundle size (gzipped equivalent)

| Subpath                           | Budget | Source                   |
| --------------------------------- | ------ | ------------------------ |
| `@mindees/ui` (full barrel)       | 80 KB  | grows as Phases 2–6 land |
| `@mindees/ui/theme`               | 16 KB  |                          |
| `@mindees/ui/layout-intelligence` | 16 KB  |                          |
| `@mindees/ui/providers`           | 12 KB  |                          |

Per-component budgets land alongside each component in Phase 2+. Enforced by `scripts/check-bundle-budget.mjs` in CI.

### Render perf (Reassure)

Every PR runs Reassure against `origin/main` and fails the build on a > 10% regression in render duration for any scenario.

Scenarios live in `packages/core/src/**/__perf__/*.perf-test.tsx`. Each one renders a representative tree, scripts a small interaction, and records render counts + duration.

### Runtime perf (Flashlight)

Manually-triggered before each release: `pnpm flashlight` against the example app's kitchen-sink screen on a low-end Android target. Target: sustained 60 fps with no dropped frames during pan/scroll/press flows.

## Enforced rules (by lint or test)

- Animations live on the UI thread via Reanimated worklets. JS-thread animation is a review block.
- No inline object/style allocations in hot paths. `eslint-plugin-react-native`'s `no-inline-styles` is enabled.
- `memo` + stable callbacks/refs are the default for any component that renders inside a list.
- Long lists use `FlashList` from `@shopify/flash-list`. Mapping over large arrays in JSX is a review block.
- All published packages set `"sideEffects": false` and use subpath exports.

## How to investigate a regression

1. Reproduce locally: `pnpm --filter @mindees/ui test:perf`.
2. The output diff identifies the slowest scenario and the components in its tree.
3. Profile in the example app with the React Native DevTools profiler (New Arch Fabric inspector).
4. Common culprits: a new context that flushes too widely; a non-stable style object in render; an effect chain that triggers a re-render storm.
