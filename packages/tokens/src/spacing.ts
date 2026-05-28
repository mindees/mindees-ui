// 4-point base spacing scale. Components must consume named tokens — never
// raw numbers — so density scaling and theme swaps stay coherent.
//
// Why 4-point (2026 best practice, validated against Atlassian, Carbon,
// Material 3, and Apple HIG):
//   - Every step is a multiple of 4 (the lone exception, 3xs = 2, is a
//     deliberate hairline for icon/badge insets). 4-pt gives denser, more
//     precise control than a pure 8-pt grid while staying screen-scalable.
//   - Low multiples (xs–md, 8–16) are for *internal* spacing: component
//     padding and gaps between tightly-related elements.
//   - High multiples (xl and up, 24–96) are for *external* spacing: margins
//     between sections and unrelated groups.
//   - Internal ≤ external rule: a component's inner padding should never
//     exceed the space separating it from its neighbours. The Layout
//     Intelligence Layer's gap rules encode this automatically.
//   - Line-height (see typography tokens) is kept on the 4-pt grid even when
//     font-size is not, to preserve vertical rhythm.

export const space = {
  none: 0,
  '3xs': 2,
  '2xs': 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  '5xl': 64,
  '6xl': 80,
  '7xl': 96,
} as const;

export type SpaceToken = keyof typeof space;

// Touch-target sizing follows Fitts's Law and platform HIGs. iOS HIG calls
// for 44pt; Material 3 says 48dp. We pick the larger so components are
// comfortable on both platforms by default. Use `min` to enforce, `cozy`
// as the default Button/IconButton height, and `dense` for table-row controls.
export const minTouchTarget = {
  dense: 36,
  cozy: 44,
  comfortable: 48,
} as const;

export type TouchTargetToken = keyof typeof minTouchTarget;
