// Density modes scale spacing and touch targets without changing the design
// language. Components read this from the theme context.

export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export interface DensityScale {
  readonly spaceMultiplier: number;
  readonly touchTarget: 'dense' | 'cozy' | 'comfortable';
  readonly textLineHeightAdjust: number;
}

export const densityScales: Record<DensityMode, DensityScale> = {
  compact: { spaceMultiplier: 0.85, touchTarget: 'dense', textLineHeightAdjust: -1 },
  comfortable: { spaceMultiplier: 1, touchTarget: 'cozy', textLineHeightAdjust: 0 },
  spacious: { spaceMultiplier: 1.2, touchTarget: 'comfortable', textLineHeightAdjust: 1 },
} as const;
