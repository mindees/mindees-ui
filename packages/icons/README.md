<p align="center">
  <a href="https://mindees-ui.vercel.app">
    <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI — SVG icon library for React Native and Expo" width="120" height="120" />
  </a>
</p>

<h1 align="center">@mindees/icons</h1>

<p align="center">
  <b>Tree-shakeable SVG icon library for React Native and Expo</b> — 60+ icons, every one a named export, built on <code>react-native-svg</code>, customizable via <code>size</code> / <code>color</code> / <code>strokeWidth</code>, ready for the New Architecture and React Native Web.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@mindees/icons"><img src="https://img.shields.io/npm/v/@mindees/icons?label=%40mindees%2Ficons&logo=npm&color=cb3837" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/@mindees/icons"><img src="https://img.shields.io/npm/dm/@mindees/icons?label=downloads&logo=npm" alt="downloads" /></a>
  <a href="https://bundlephobia.com/package/@mindees/icons"><img src="https://img.shields.io/bundlephobia/minzip/@mindees/icons?label=size" alt="bundle size" /></a>
  <a href="https://github.com/mindees/mindees-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT license" /></a>
</p>

---

## Features

- 🎨 **60+ SVG icons for React Native + Expo + React Native Web** — every icon is a `react-native-svg` component, renders crisp at any size.
- 🪶 **Tree-shakeable** — named exports + `sideEffects: false` means you only ship the icons you import.
- 🧠 **TypeScript-strict** — props fully typed; `ref` forwards to the underlying `Svg` element.
- 🎚️ **`size` + `color` + `strokeWidth`** — single-prop sizing (defaults to `24`), `currentColor` inheritance for theme-driven recolouring, and adjustable stroke weight.
- 🏭 **`createIcon` factory** — drop-in for your own SVG glyphs without forking the package.
- ⚡ **New-Architecture-ready** — works on Fabric, JSI, TurboModules, Bridgeless. iOS, Android, web.

## Install

```sh
pnpm add @mindees/icons react-native-svg
# or
npm install @mindees/icons react-native-svg
# or
yarn add @mindees/icons react-native-svg
```

`react-native-svg` is a peer dependency (also required by `@mindees/ui` directly).

## Quickstart

```tsx
import { CheckIcon, CloseIcon, SearchIcon } from '@mindees/icons';

<CheckIcon size={20} color="green" />
<CloseIcon size={24} color="#ff0000" />
<SearchIcon size={16} color="currentColor" strokeWidth={1.5} />
```

Inside a themed component, lean on `currentColor`:

```tsx
import { useTokens } from '@mindees/ui';
import { CheckIcon } from '@mindees/icons';

function Indicator() {
  const t = useTokens();
  return <CheckIcon size={20} color={t.colors.status.success} />;
}
```

## API

### Icon set (60+ glyphs)

Feather-style glyphs — a single 24×24 stroke path each — grouped by use. Every icon is a named export ending in `Icon`.

| Group               | Icons                                                                                                                                                                                                                  |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Chevrons**        | `ChevronDownIcon`, `ChevronUpIcon`, `ChevronLeftIcon`, `ChevronRightIcon`                                                                                                                                              |
| **Arrows**          | `ArrowUpIcon`, `ArrowDownIcon`, `ArrowLeftIcon`, `ArrowRightIcon`                                                                                                                                                      |
| **Actions**         | `PlusIcon`, `MinusIcon`, `EditIcon`, `TrashIcon`, `SaveIcon`, `CopyIcon`, `ShareIcon`, `DownloadIcon`, `UploadIcon`, `RefreshIcon`, `FilterIcon`, `SortIcon`, `SettingsIcon`, `MoreHorizontalIcon`, `MoreVerticalIcon` |
| **Navigation / UI** | `HomeIcon`, `MenuIcon`, `BellIcon`, `GridIcon`, `ListIcon`, `ExternalLinkIcon`, `SearchIcon`, `CloseIcon`, `CheckIcon`                                                                                                 |
| **Status**          | `InfoIcon`, `WarningIcon`, `ErrorIcon`, `CheckCircleIcon`, `XCircleIcon`, `HelpIcon`                                                                                                                                   |
| **Media**           | `PlayIcon`, `PauseIcon`, `StopIcon`, `CameraIcon`, `ImageIcon`, `VideoIcon`, `MicIcon`, `VolumeIcon`                                                                                                                   |
| **Common**          | `UserIcon`, `UsersIcon`, `LockIcon`, `UnlockIcon`, `MailIcon`, `PhoneIcon`, `CalendarIcon`, `ClockIcon`, `EyeIcon`, `EyeOffIcon`, `HeartIcon`, `StarIcon`, `BookmarkIcon`, `MapIcon`, `GlobeIcon`                      |

Need a glyph that isn't here? Use the [`createIcon` factory](#createicon-factory) below — no fork required.

### Props

```ts
interface IconProps extends Omit<SvgProps, 'children'> {
  /** Icon size in dp. Sets both width and height. Defaults to 24. */
  size?: number;
  /** Stroke / fill color. Defaults to 'currentColor' for inheritance. */
  color?: string;
  /** Stroke width of the glyph path. Defaults to 2. */
  strokeWidth?: number;
}
```

Any other valid `SvgProps` (e.g. `style`, `accessibilityLabel`, `testID`) pass through.

### `createIcon` factory

Define your own glyphs using the same factory the built-ins use:

```tsx
import { createIcon } from '@mindees/icons';

export const TriangleIcon = createIcon({
  name: 'Triangle',
  viewBox: '0 0 24 24',
  path: 'M12 2L2 22h20L12 2z',
});

// ...usage anywhere:
<TriangleIcon size={32} color="orange" />;
```

## Compatibility

Same as `@mindees/ui`: Expo SDK 55 / 56 (React Native 0.83 / 0.85), React 19.1+, New Architecture only.

## License

[MIT](https://github.com/mindees/mindees-ui/blob/main/LICENSE) © 2026 MindeesUI contributors

---

<details>
<summary><b>Keywords</b> (for npm + Google search)</summary>

react-native-icons · react-native-svg-icons · expo-icons · svg-icon-library · icon-component · tree-shakeable-icons · named-exports · react-native-svg · cross-platform-icons · ios · android · react-native-web · typescript · strict-types · new-architecture · fabric · jsi · custom-icons · createicon · ui-icons · feather-icons · heroicons-alternative · lucide-alternative · react-native-vector-icons-alternative · stroke-icons · customizable-icons · mindees-ui · react-native-ui-library · react-native-component-library · icon-set · vector-icons · scalable-icons

</details>
