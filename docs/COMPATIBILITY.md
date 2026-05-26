# Compatibility Matrix

> **Verification date:** 2026-05-26 (live `npm view` against the public registry).
> Re-run `pnpm verify:versions` before each minor release. This file is the single source of truth for peer-dependency ranges; the matrix is enforced by CI.

## Target runtimes

MindeesUI v1 supports the latest stable Expo SDK and one previous, on the New Architecture only (Fabric + JSI + TurboModules + Bridgeless). Expo SDK 55 was the first release where New Arch is unconditionally on (the `newArchEnabled` flag was removed); SDK 56 continues this.

| Runtime | Min | Recommended | Notes |
|---|---|---|---|
| Node.js | 20.x | 22.x LTS | required for the toolchain (Turbo, builder-bob, Next docs) |
| React | 19.1 | 19.2.6 | RN 0.83/0.85 both accept `react: *` but 19.x is the validated baseline |
| React Native | 0.83.x | 0.85.3 | New Arch only |
| Expo SDK | 55 | 56 | both supported; CI runs both matrices |
| iOS | 15.1+ | 17+ | matches RN 0.85 baseline |
| Android | API 24+ | API 34+ | matches RN 0.85 baseline |

> **What the spec assumed vs reality:** the original brief assumed SDK 55 = latest stable and SDK 56 = upcoming. As of 2026-05-26, **SDK 56 (Expo 56.0.4) is the latest stable** and SDK 55 is n-1. SDK 57 exists only as a canary build and is not yet a v1 target.

## Peer dependencies (verified 2026-05-26)

These are the *known-good* versions resolved from the npm registry on the verification date. Peer ranges in each package's `package.json` are slightly wider to accommodate patch releases; CI installs the locked versions in `pnpm-lock.yaml`.

| Package | Verified version | New Arch | Required by |
|---|---|---|---|
| `react-native-reanimated` | 4.3.1 | ✅ worklets | layout-intelligence transitions, animated primitives, Unistyles runtime |
| `react-native-gesture-handler` | 2.31.2 | ✅ | Pressable hit-slop, BottomSheet, Drawer, Tabs swipes |
| `@shopify/flash-list` | 2.3.1 | ✅ v2 | every long-list component, FlatList wrapper fallback |
| `react-native-unistyles` | 3.2.4 | ✅ Nitro | styling engine (abstracted behind `createStyles`) |
| `react-native-nitro-modules` | latest | ✅ | required by Unistyles 3 |
| `react-native-edge-to-edge` | latest | ✅ | required by Unistyles 3 |
| `react-native-safe-area-context` | 5.8.0 | ✅ | SafeAreaView, ScreenWrapper, top/bottom insets |
| `react-native-screens` | 4.25.2 | ✅ | optional; only consumed by example app routing |
| `react-native-svg` | 15.15.5 | ✅ | Icon, CircularProgress, ColorPicker, SignaturePad |
| `@gorhom/bottom-sheet` | 5.2.14 | ✅ | BottomSheet (gated; falls back to Modal if absent) |

## Optional Expo peers (gated)

These are only required if you use the matching component. The component will throw a descriptive error at import time if the peer is missing, or use a graceful fallback where one exists.

| Peer | Used by | Fallback |
|---|---|---|
| `expo-image` | `Image` | `react-native` `Image` |
| `expo-haptics` | `Button`, `Toggle`, `Slider`, etc. (gated) | no haptics |
| `expo-blur` | `Modal`/`BottomSheet` backdrop blur | semi-opaque background |
| `expo-camera` | `Camera`, `BarcodeScanner` | error at use site |
| `expo-image-picker` | `ImagePicker`/`FileUpload` | error at use site |
| `expo-location` + `react-native-maps` | `MapView` wrapper | error at use site |

## Tooling versions (verified 2026-05-26)

| Tool | Version |
|---|---|
| pnpm | 11.3.0 |
| Turborepo | 2.9.14 |
| react-native-builder-bob | 0.41.0 |
| TypeScript | 5.6.x |
| Jest | 29.x via `jest-expo` / `@testing-library/react-native` |
| ESLint | 9.x (flat config) |
| @callstack/reassure | 1.4.1 |
| fumadocs-core | 16.9.1 |

## Re-verification

```sh
pnpm verify:versions   # runs scripts/verify-versions.mjs against npm and fails if anything drifts
```

The script reads this table, queries `npm view <pkg> version` for each entry, and reports a diff. Update the verified-version column when you intentionally bump a peer.
