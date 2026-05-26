# Contributing to MindeesUI

Thanks for the interest. This guide covers local setup, the quality gate, and how to add a new component.

## Prerequisites

- Node 20+ (22 LTS recommended)
- pnpm 11+
- Watchman (macOS/Linux) or the WSL equivalent (Windows)
- Xcode 15+ / Android Studio Iguana+ if you'll run the example app natively

## Setup

```sh
pnpm install
pnpm verify:versions   # confirms docs/COMPATIBILITY.md still matches npm
```

## Useful scripts

```sh
pnpm typecheck         # tsc --noEmit across the monorepo
pnpm lint              # eslint flat config
pnpm test              # jest unit + a11y tests
pnpm test:coverage     # writes coverage/ per package; CI enforces ≥ 90%
pnpm build             # builder-bob across packages
pnpm example start     # boot the Expo example app
pnpm docs dev          # boot the Fumadocs site at :3000
pnpm storybook         # Storybook for RN web + Expo (Phase 1+)
```

## Quality gate (CI runs all of these)

A PR cannot merge unless every check passes:

1. **Types** — `tsc --noEmit`, `strict: true`, no `any` in public exports.
2. **Lint** — ESLint flat config, zero warnings.
3. **Format** — Prettier check.
4. **Unit + a11y tests** — Jest + React Native Testing Library, ≥ 90% coverage.
5. **Build** — builder-bob produces ESM + CJS + types for every published package.
6. **Bundle budget** — `scripts/check-bundle-budget.mjs` per-package size guard.
7. **Perf regression** — Reassure compares against `origin/main`.
8. **Version drift** — `scripts/verify-versions.mjs` against `docs/COMPATIBILITY.md`.

## Adding a new component

A new component is "done" when it satisfies every line in **Definition of Done**:

- [ ] Typed (`strict`, no `any` in props)
- [ ] Themed (works under `lightTheme`, `darkTheme`, both high-contrast themes)
- [ ] Layout-intelligence: tagged with `tagComponent`; consumes the contexts that apply; documented behavior is matched by tests
- [ ] Variants exposed via Unistyles' `variants` (when applicable)
- [ ] A11y: `accessibilityRole`, label, focus order, `useReduceMotion` honored, RTL safe, dynamic-type safe
- [ ] Perf budget met (no inline style/object allocation in hot paths, no JS-thread animations)
- [ ] Storybook story
- [ ] Docs page with live demo + props table + microcopy notes
- [ ] Works in **both** Expo and bare RN example apps
- [ ] A `pnpm changeset` entry describing the addition

## Branches & changesets

- Branch from `main`.
- Run `pnpm changeset` whenever you touch a published package (`@mindees/*`). It writes a small markdown file describing the intended version bump.
- Open a PR; CI runs the full quality gate; reviewer merges to `main`; the `release` job opens / merges a "Version Packages" PR and `pnpm release` publishes when that lands.

## Reporting issues

Use the GitHub issue tracker. For security reports, do not file a public issue — email `security@mindees.dev` (placeholder during early development).
