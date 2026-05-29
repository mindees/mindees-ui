# @mindees/tokens

## 1.1.0

### Minor Changes

- [`ab9d543`](https://github.com/mindees/mindees-ui/commit/ab9d5432b4b96f8b096e86b232be5ebcbc74878f) Thanks [@aashir-athar](https://github.com/aashir-athar)! - ## 1.1.0 — ~90 new primitives, easy theming, and the new `@mindees/blocks` package

  ### `@mindees/ui` — ~90 new components

  Forms: `EmailInput`, `PhoneInput`, `NumberInput`, `CurrencyInput`, `OTPInput`, `PINInput`, `Select`, `MultiSelect`, `Autocomplete`, `TagInput`, `Slider`, `RangeSlider`, `DatePicker`, `DateRangePicker`, `TimePicker`, `FilePicker`, `ImagePicker`.

  Data display: `Table`, `DataGrid`, `Carousel`, `ImageGallery`, `TreeView`, `Calendar`, `KPICard`, `DetailView`, `KeyValueRow`, `DescriptionList`, `Pill`, `Feed`, `ActivityLog`.

  Overlays: `Dialog`, `ConfirmationDialog`, `Snackbar`, `Banner`, `Notification`, `DropdownMenu`, `ContextMenu`, `SidePanel`, `Lightbox`, `FullscreenOverlay`, `HoverCard`, `MegaMenu`, `CommandPalette`.

  States: `EmptyState`, `ErrorState`, `OfflineState`, `MaintenanceState`, `LoadingState`, `SuccessState`, `WarningState`, `InfoState`.

  Buttons: `SplitButton`, `ToggleButton`, `CloseButton`, `CopyButton`, `ShareButton`, `DownloadButton`, `UploadButton`, `RetryButton`, `BackButton`.

  Typography: `Paragraph`, `Subheading`, `HelperText`, `ErrorText`, `QuoteBlock`, `Mark`, `TruncatedText`, `ReadMore`, `RichText`.

  Media (gated peers with `MissingPeer` fallback): `ResponsiveImage`, `ImagePreview`, `FilePreview`, `Logo`, `VideoPlayer`, `AudioPlayer`, `PDFViewer`, `QRScanner`, `BarcodeScanner`, `LottieView`.

  Navigation & mobile: `BottomNavigation`, `UserMenu`, `SettingsMenu`, `GlobalSearch`, `SwipeActions`, `SwipeableCard`, `PullToRefresh`, `InfiniteScroll`.

  ### Easy theming

  `createThemes({ light: { brand }, dark: { brand } })` generates a matched light+dark theme pair from a single brand color per scheme (hover/active shades and a readable on-accent color are derived). `themeTemplate` is a copy-edit starter. `createTheme` now deep-merges every token category and `density` actually scales the spacing rhythm. `@mindees/ui` re-exports `@mindees/tokens`.

  ### Customizability

  Every primitive now forwards `style` (caller-wins), spreads native props, and forwards refs.

  ### Cross-platform & correctness

  Web shadows (`boxShadow`), Layout Intelligence fixes (SafeAreaView/Chip tags, `Input → Button` spacing), `Stack` distribution fix. Perf-tuned for low-end Android (memo, native-driver animations, FlatList, hoisted styles).

  ### `@mindees/tokens`

  Web `boxShadow` support in `resolveShadow`; documented 2026 4-point-grid spacing rationale.

## 1.0.1

### Patch Changes

- [`35e3c77`](https://github.com/mindees/mindees-ui/commit/35e3c779c1b019a68cf5c8eb02b691bfc8aee5af) Thanks [@aashir-athar](https://github.com/aashir-athar)! - Update npm package metadata and README links: point `homepage` and all README doc links at the live docs site (https://mindees-ui.vercel.app), add `repository` (with `directory`) and `bugs` fields to `@mindees/tokens` and `@mindees/icons` so the npm listing renders proper "Repository" and "Issues" links. The root README "Components" link now targets the new `/docs/components` overview. No code changes.
