export declare const duration: {
  readonly instant: 0;
  readonly fastest: 80;
  readonly fast: 150;
  readonly base: 220;
  readonly slow: 320;
  readonly slower: 480;
  readonly slowest: 640;
};
export type DurationToken = keyof typeof duration;
export declare const easing: {
  readonly linear: readonly [0, 0, 1, 1];
  readonly standard: readonly [0.2, 0, 0, 1];
  readonly emphasised: readonly [0.3, 0, 0, 1];
  readonly emphasisedAccel: readonly [0.3, 0, 0.8, 0.15];
  readonly emphasisedDecel: readonly [0.05, 0.7, 0.1, 1];
  readonly bounce: readonly [0.34, 1.56, 0.64, 1];
};
export type EasingToken = keyof typeof easing;
//# sourceMappingURL=motion.d.ts.map
