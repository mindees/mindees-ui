export declare const breakpoints: {
  readonly xs: 0;
  readonly sm: 360;
  readonly md: 600;
  readonly lg: 900;
  readonly xl: 1200;
  readonly '2xl': 1536;
};
export type BreakpointToken = keyof typeof breakpoints;
export type ResponsiveValue<T> = T | Partial<Record<BreakpointToken, T>>;
//# sourceMappingURL=breakpoints.d.ts.map
