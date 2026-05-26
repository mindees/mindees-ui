# Architecture

This document is the source of truth for the **Layout Intelligence Layer** (LIL) — the deterministic engine that makes "drop children in and it looks right" work in MindeesUI. Every heuristic below is implemented in [`packages/core/src/layout-intelligence`](../packages/core/src/layout-intelligence) and covered by tests in `__tests__/`.

## Principles

1. **Deterministic.** Every behavior is a typed function of its inputs, not a model. Same children + same parent context = same output, always.
2. **Documented.** Every rule below is listed by name and matched 1:1 to a test case.
3. **Overridable.** Every inferred prop can be set explicitly. The override always wins.
4. **Tree-shakeable.** The LIL is split into small modules; consumers only pay for the heuristics they actually trigger.
5. **No runtime cost when idle.** Heuristics run during render of the parent only — never on the UI thread, never in a worklet.

## Building blocks

### Tagged components

Every MindeesUI component carries a `Symbol.for('@mindees/ui:component-tag')` identifying it ("Button", "Heading", "Text", ...). Children can be classified at the parent without `displayName` sniffing, and the symbol survives across module realms (duplicate copies of the library).

API: `tagComponent`, `getComponentTag`, `isTaggedAs`.

### Slot / asChild

Radix-style prop-merging slot. `<Slot {...parent}><Child /></Slot>` returns the Child with merged props:

| Prop family | Merge rule |
|---|---|
| `onX` event handlers | child first, then parent (parent skipped if `evt.defaultPrevented`) |
| `style` | array (`[parentStyle, childStyle]`); RN flattens, child wins on conflict |
| `className` (web) | concatenated |
| `ref` | both forwarded via `mergeRefs` |
| any other prop | child wins |

Components opt into this with `asChild`: `function Trigger({ asChild, ...rest }) { const Comp = asChild ? Slot : Pressable; return <Comp {...rest} />; }`.

### Child introspection

`flattenChildren` collapses fragments and arrays; `describeChildren` returns positional slots `{ element, tag, index, isFirst, isLast }`. Parents iterate these to round outer corners, hide last dividers, etc. — without re-rendering children.

### Auto-spacing rules

Stack/HStack/VStack take a base `gap` token, then for each consecutive pair `(prev, next)` apply a deterministic rule:

| Rule | Multiplier | Triggered by |
|---|---|---|
| `tighter` | × 0.25 | Heading↔Caption/Label (eyebrow text group) |
| `tight` | × 0.5 | Text→Text (continuous prose) |
| `base` | × 1 | anything else |
| `loose` | × 1.5 | Heading→Text (hierarchy break); content→Button (trailing action) |
| `looser` | × 2 | (reserved for section breaks) |

Implemented in `spacing-rules.ts`. Each row has a test in `__tests__/spacing-rules.test.ts`.

### Intrinsic sizing

`width` and `height` accept `IntrinsicSize = 'fill' | 'hug' | number | '${number}%'`:

| Input | Maps to |
|---|---|
| `fill` | `{ flexGrow: 1, flexShrink: 1, flexBasis: 0 }` |
| `hug` | `{ flexShrink: 0 }` (intrinsic content size) |
| number | `width: N` or `height: N` |
| `${N}%` | `width: 'N%'` or `height: 'N%'` |

Implemented in `sizing.ts`. Tested in `__tests__/sizing.test.ts`.

### Specialised contexts (parent → child wiring)

Each compound parent provides a typed context describing only what its children need. Children read whichever contexts apply, and components without a wrapping parent fall back to sensible defaults.

| Context | Provided by | Read by |
|---|---|---|
| `ButtonGroupContext` | `ButtonGroup` | `Button`, `IconButton` (corner-merging, size sync) |
| `ListContext` | `List` | `ListItem` (density, dividers) |
| `StackContext` | `Stack`/`HStack`/`VStack` | direct children (axis-aware spacing) |
| `FormFieldContext` | `FormField` | `Input`, `Label`, `HelperText`, `ErrorMessage` (a11y wiring) |
| `CardContext` | `Card` | `Card.Header`, `Card.Body`, `Card.Footer` (density, variant) |

### Responsive + density

The theme exposes `breakpoints` (xs..2xl) and a `density` mode (compact/comfortable/spacious). Components use the `useResponsive(value)` hook (lands in Phase 2) which prefers parent-container width when available and falls back to window width.

### Accessibility auto-wiring

- `FormField` issues a stable id and threads `labelId` / `descriptionId` / `errorId` through `FormFieldContext`. The `Input` sets `accessibilityLabelledBy` automatically; `Label` and `HelperText` get matching `nativeID`s.
- Compound display components emit grouping roles automatically (`ButtonGroup` → `role="group"`, `List` → `role="list"`, `ListItem` → `role="listitem"`).
- All inferred a11y props are overridable; an explicit `accessibilityLabel` always wins.
- `useReduceMotion()` gates every animation in the library.

## Theming

`ThemeProvider` provides a `Theme` object (`name`, `colorScheme`, `contrast`, `density`, `tokens`). Themes are built with `createTheme({ name, colorScheme, contrast?, density?, colors? })`. Styling is implemented via Unistyles v3 under a thin `createStyles` wrapper (Phase 2) so the engine stays swappable.

System triggers `ThemeProvider` listens to:

- `Appearance.addChangeListener` for system dark/light
- `AccessibilityInfo.reduceMotionChanged` for prefers-reduced-motion
- `AccessibilityInfo.isDarkerSystemColorsEnabled` (where available) for high-contrast

When no `<ThemeProvider>` wraps a component, hooks return `lightTheme` — keeps stories renderable without setup.

## Portals

`PortalProvider` registers a fixed set of z-ordered hosts (`modal`, `bottom-sheet`, `popover`, `tooltip`, `toast`). `<Portal host="modal">…</Portal>` mounts into the matching host. Hosts use `pointerEvents="box-none"` so they don't block interaction with the underlying tree.

## File map (Phase 1)

```
packages/core/src/
├─ index.ts
├─ theme/
│  ├─ createTheme.ts          — Theme type + factory + 4 built-in themes
│  ├─ ThemeProvider.tsx       — context + system listeners + useTheme/useTokens/useReduceMotion
│  ├─ __tests__/createTheme.test.ts
│  └─ index.ts
├─ layout-intelligence/
│  ├─ tagged-component.ts     — Symbol-based component identity
│  ├─ child-introspection.ts  — flattenChildren / describeChildren
│  ├─ sizing.ts               — fill / hug / fixed → flex
│  ├─ spacing-rules.ts        — heading→body, body→body, etc.
│  ├─ Slot.tsx                — Radix-style asChild + mergeRefs
│  ├─ context.ts              — ButtonGroup/List/Stack/FormField/Card contexts
│  ├─ __tests__/*.test.ts(x)
│  └─ index.ts
└─ providers/
   ├─ PortalProvider.tsx      — named hosts + Portal
   ├─ ErrorBoundary.tsx       — class component with retry
   └─ index.ts
```
