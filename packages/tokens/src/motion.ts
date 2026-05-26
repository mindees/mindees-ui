// Doherty Threshold: every interaction acknowledges within ~400ms.
// Components default to `fast` (150ms) for press/hover feedback and `base`
// (220ms) for state changes. Anything > `slower` should give the user some
// other form of progress affordance (skeleton, spinner, optimistic UI).

export const duration = {
  instant: 0,
  fastest: 80,
  fast: 150,
  base: 220,
  slow: 320,
  slower: 480,
  slowest: 640,
} as const;

export type DurationToken = keyof typeof duration;

// Standard cubic-bezier curves, named by intent rather than vendor.
// `emphasised` curves are Material 3 style — strong start, soft finish.
export const easing = {
  linear: [0, 0, 1, 1],
  standard: [0.2, 0, 0, 1],
  emphasised: [0.3, 0, 0, 1],
  emphasisedAccel: [0.3, 0, 0.8, 0.15],
  emphasisedDecel: [0.05, 0.7, 0.1, 1],
  bounce: [0.34, 1.56, 0.64, 1],
} as const;

export type EasingToken = keyof typeof easing;
