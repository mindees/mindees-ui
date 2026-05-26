# Roadmap

## Honesty clause

The original brief asked for four things that can't be _guaranteed_. Each was translated into an engineering condition that produces them in expectation:

| Original ask                          | Engineering substitute we actually deliver                                                                                                 |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| "No single error / no single mistake" | TypeScript strict, ≥ 90% test coverage, CI gates that block merge on type/lint/test/a11y failure. Near-zero-defect, not magically zero.    |
| "100% performance optimized"          | Measurable perf budgets verified with Reassure (render-perf regression) and Flashlight (runtime fps). Documented in `docs/PERFORMANCE.md`. |
| "Ranked #1 on search engines"         | Technical SEO done to spec (sitemap, JSON-LD, Core Web Vitals green, `llms.txt`, strong README). Ranking is _earned_, not promised.        |
| "Something never done before"         | A genuinely novel **deterministic** Layout Intelligence Layer — smart composition, not AI magic. Documented in `docs/ARCHITECTURE.md`.     |

## Phase status

### ✅ Phase 0 — Foundation (done, unrun)

- Monorepo (pnpm workspaces + Turborepo) — written
- Root configs: tsconfig.base, ESLint flat config, Prettier, .gitignore, .npmrc, .nvmrc — written
- LICENSE (MIT), README, CONTRIBUTING — written
- `docs/COMPATIBILITY.md` with versions verified live on 2026-05-26 — written
- packages/core, packages/tokens, packages/icons — scaffolded with builder-bob config, subpath exports, tsconfig, jest config
- apps/example (Expo SDK 56 + expo-router) — scaffolded
- apps/docs (Next.js + Fumadocs) — scaffolded
- `.github/workflows/ci.yml` with the SDK 55 × SDK 56 matrix and quality gates — written
- Changesets configured (`@mindees/ui`, `@mindees/tokens`, `@mindees/icons` linked) — written
- `scripts/verify-versions.mjs` — written
- `scripts/check-bundle-budget.mjs` — written

> **Verification note:** the configs above are _written_ but not yet _run end-to-end_ in this session — `pnpm install` and a CI dry-run are the next steps before declaring Phase 0 verified.

### 🟡 Phase 1 — Foundation runtime (in progress)

Done:

- `@mindees/tokens` — full token surface (color scales + semantic + high-contrast, typography, spacing, radii, shadows, motion, breakpoints, z-index, density)
- Layout Intelligence Layer core: `tagComponent`, `Slot`, `mergeRefs`, child-introspection, sizing heuristics, spacing rules, specialised contexts
- `ThemeProvider` + `createTheme` + 4 built-in themes + system listeners (color scheme, reduce motion, high contrast)
- `PortalProvider` + `Portal`, `ErrorBoundary`
- Unit tests for every heuristic: tagged-component, Slot, child-introspection, sizing, spacing-rules, createTheme

Next:

- `createStyles` Unistyles wrapper (theme + breakpoints + variants in a typed API)
- `useResponsive(value)` hook (container-aware, falls back to window)
- A11y helpers (`useUniqueId`, `useFormFieldA11y`, `useAnnouncer`)
- Storybook config (`.storybook/`) running both on RN web and the Expo example

### ⚪ Phase 2 — Layout & Typography primitives

`Box`, `Stack`/`HStack`/`VStack`/`ZStack`, `Grid`, `Row`, `Column`, `Divider`, `Spacer`, `SafeAreaView`, `KeyboardAvoidingView`, `ScreenWrapper`, `Text`, `Heading`, `Caption`, `Label`, `Link`, `Code`, `Kbd`.

### ⚪ Phase 3 — Forms & Inputs

`Input`, `Textarea`, `PasswordInput`, `SearchInput`, `Select`, `Checkbox` + group, `Radio` + group, `Switch`, `Slider`, `DatePicker`/`TimePicker`, `OTPInput`, `PhoneInput`, `FileUpload`/`ImagePicker`. Optional Expo peers gated.

### ⚪ Phase 4 — Buttons & Overlays

`Button`, `IconButton`, `FAB`, `ButtonGroup`, `Modal`, `BottomSheet`, `Alert`/`AlertDialog`, `Toast`/`Snackbar`, `Tooltip`, `Popover`, `ActionSheet`, `Drawer`.

### ⚪ Phase 5 — Navigation, Display & Data

`Tabs`/`TabBar`, `TopBar`, `Breadcrumb`, `Pagination`, `Stepper`, `Card`, `Avatar` + group, `Badge`/`Tag`/`Chip`, `Image`, `Video`, `Icon`, `Table`, `List`/`ListItem`, `Accordion`, `Timeline`, `Stat`, `Progress`, `Skeleton`, `Spinner`, `Rating`, `Calendar`.

### ⚪ Phase 6 — Specialised

`QRCode`, `Barcode`, `MapView`, `CodeBlock`, `ColorPicker`, `SignaturePad`, `WebView`, `Camera`. All gated behind optional peers + graceful fallback.

### ⚪ Phase 7 — Docs & SEO

Fumadocs site polished with per-component pages: props table (auto from TS types), variants, a11y notes, LIL behaviour, microcopy do/don't. Live demos via Expo Snack + RN Web. Core Web Vitals green. OG images. Sitemap + JSON-LD + llms.txt.

### ⚪ Phase 8 — Release

npm publish under `@mindees/ui`, `@mindees/tokens`, `@mindees/icons` via Changesets. Docs deploy to Cloudflare Pages. Release notes via `@changesets/changelog-github`.
