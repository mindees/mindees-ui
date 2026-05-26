export type DensityMode = 'compact' | 'comfortable' | 'spacious';
export interface DensityScale {
  readonly spaceMultiplier: number;
  readonly touchTarget: 'dense' | 'cozy' | 'comfortable';
  readonly textLineHeightAdjust: number;
}
export declare const densityScales: Record<DensityMode, DensityScale>;
//# sourceMappingURL=density.d.ts.map
