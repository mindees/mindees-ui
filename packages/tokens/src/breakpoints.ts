// Min-width breakpoints in dp/px. The Layout Intelligence Layer matches
// against the parent container's measured width when available; falls back
// to the window width otherwise.

export const breakpoints = {
  xs: 0,
  sm: 360,
  md: 600,
  lg: 900,
  xl: 1200,
  '2xl': 1536,
} as const;

export type BreakpointToken = keyof typeof breakpoints;
export type ResponsiveValue<T> = T | Partial<Record<BreakpointToken, T>>;
