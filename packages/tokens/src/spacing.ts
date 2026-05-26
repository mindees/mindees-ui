// 4-point base spacing scale. Components must consume named tokens — never
// raw numbers — so density scaling and theme swaps stay coherent.

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
