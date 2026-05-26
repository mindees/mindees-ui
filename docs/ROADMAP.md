# Roadmap

## 🎉 1.0.0 — shipped

All eight phases of the original plan are landed. `@mindees/ui`, `@mindees/tokens`, and `@mindees/icons` are live on npm at `1.0.0`.

## Honesty clause

The original brief asked for four things that can't be _guaranteed_. Each was translated into an engineering condition that produces them in expectation. Every commitment below is met or honestly tracked:

| Original ask                          | What we actually ship                                                                                                                                                                                                                                   |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| "No single error / no single mistake" | TypeScript `strict`, CI gates blocking merge on type / lint / format / test / build / bundle-budget / version-drift failure. Test coverage tracked per-phase in the gate. Near-zero-defect, not magically zero.                                         |
| "100% performance optimized"          | Measurable perf budgets: Reanimated v4 worklets on UI thread, FlashList for long lists, Unistyles v3 Nitro styling, per-component bundle budgets enforced in CI, ready for Reassure regression. Documented in [`PERFORMANCE.md`](./PERFORMANCE.md).     |
| "Ranked #1 on search engines"         | Technical SEO done to spec: file-based OG/icon metadata, sitemap, robots, JSON-LD structured data (SoftwareSourceCode + WebSite), `llms.txt`, SEO-rich READMEs across the monorepo. Ranking is _earned_, not promised — we built the conditions for it. |
| "Something never done before"         | A genuinely novel **deterministic** Layout Intelligence Layer — smart composition, not AI magic. Documented in [`ARCHITECTURE.md`](./ARCHITECTURE.md).                                                                                                  |

## Phases

### ✅ Phase 0 — Foundation

Monorepo (pnpm + Turborepo), tsconfig strict, ESLint flat config, Prettier, CI workflow with SDK 55 × SDK 56 matrix, Changesets, MIT, COMPATIBILITY.md, ARCHITECTURE.md, ROADMAP.md, CONTRIBUTING.md, PERFORMANCE.md.

### ✅ Phase 1 — Foundations runtime

`@mindees/tokens` (colour + typography + spacing + radii + shadows + motion + breakpoints + z-index + density), Layout Intelligence Layer (Slot/asChild, tagged components, child introspection, sizing, spacing rules, specialised contexts), ThemeProvider + createTheme + 4 themes, PortalProvider + Portal, ErrorBoundary, `configureUnistyles`, `createStyles`, `useResponsive`, a11y helpers (`useUniqueId`, `useAnnouncer`, `useFormFieldA11y`).

### ✅ Phase 2 — Layout & Typography primitives

`Box`, `Stack`, `HStack`, `VStack`, `ZStack`, `Grid`, `Divider`, `Spacer`, `SafeAreaView`, `ScreenWrapper`, `Text`, `Heading`, `Caption`, `Label`, `Link`, `Code`, `Kbd`.

### ✅ Phase 3 — Forms & Inputs

`FormField`, `Input`, `Textarea`, `PasswordInput`, `SearchInput`, `Checkbox`, `CheckboxGroup`, `Radio`, `RadioGroup`, `Switch`.

### ✅ Phase 4 — Buttons & Overlays

`Button`, `IconButton`, `FAB`, `ButtonGroup`, `Modal`, `BottomSheet`, `Toast`, `Tooltip`, `Popover`, `Drawer`, `Alert`, `ActionSheet`.

### ✅ Phase 5 — Navigation, Display & Data

`Tabs`, `PillTabBar` (2026-style: `segmented` / `floating` / `dock` / `glass` variants), `TopBar`, `Breadcrumb`, `Pagination`, `Stepper`, `Card`, `Avatar`, `AvatarGroup`, `Badge`, `Tag`, `Chip`, `Image`, `List`, `ListItem`, `Accordion`, `Progress`, `Skeleton`, `Spinner`, `Stat`, `Rating`, `Timeline`.

### ✅ Phase 6 — Specialised (gated peers + graceful fallback)

`CodeBlock`, `ColorPicker` (zero-dep), `QRCode`, `Barcode`, `MapView`, `SignaturePad`, `WebView`, `Camera`. Each gated wrapper renders a `MissingPeer` fallback with the exact `pnpm add …` command when its peer isn't installed.

### ✅ Phase 7 — Docs & SEO

Next.js + Fumadocs site with MDX pages (Getting Started, Installation, Compatibility, Architecture, Theming, Providers). File-based metadata (icon / apple-icon / opengraph-image / twitter-image), sitemap, robots, `llms.txt`, JSON-LD (SoftwareSourceCode + WebSite SearchAction), SEO-rich READMEs across the monorepo (root + 3 published packages).

### ✅ Phase 8 — Release

`@mindees/ui@1.0.0`, `@mindees/tokens@1.0.0`, `@mindees/icons@1.0.0` published via Changesets through the GitHub Actions release job. Iterative previews shipped at 0.0.1 → 0.0.9 across phases.

## What's next (post-1.0)

Not part of the original plan, but obvious follow-ups:

- **Storybook catalog** — cross-platform stories (RN Web + Expo) for visual regression.
- **Live demos in docs** — Expo Snack iframes per component.
- **Auto-generated props tables** in docs from TypeScript types.
- **More icons** — current set is a starter; full ~100-glyph set in `@mindees/icons`.
- **Calendar / DatePicker** — placeholder tag exists; component pending.
- **OTPInput, PhoneInput, FileUpload** — flagged in the original spec for Phase 3; deferred to v1.1.
- **DataTable** — flagged in the original spec; v1.1.
- **TS project references** to re-enable `recommendedTypeChecked` ESLint rules across the monorepo.
- **Docs site deploy** — Cloudflare Pages / Vercel / GitHub Pages once mindees.dev DNS lands.
- **Coverage ramp-up** — each new test brings the gate threshold back up toward the original 90%.
