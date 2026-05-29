---
'@mindees/ui': minor
'@mindees/tokens': minor
---

## 1.1.0 — ~90 new primitives, easy theming, and the new `@mindees/blocks` package

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
