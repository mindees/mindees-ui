import { space, type SpaceToken } from '@mindees/tokens';

import type { ComponentTag } from './tagged-component';

// Auto-spacing heuristics for Stack/HStack/VStack. The user-supplied `gap`
// is the base; we increase it when the visual contrast between two adjacent
// children is high (e.g. Heading → Body) and decrease it when they belong
// to the same "tight group" (e.g. Heading → Caption directly under it).
//
// All rules are deterministic and documented. Each rule is paired with a
// unit test in `__tests__/spacing-rules.test.ts`.

export type GapRule = 'tighter' | 'tight' | 'base' | 'loose' | 'looser';

const GAP_MULTIPLIER: Record<GapRule, number> = {
  tighter: 0.25,
  tight: 0.5,
  base: 1,
  loose: 1.5,
  looser: 2,
};

const HEADINGS: readonly ComponentTag[] = ['Heading'];
const SECONDARY_TEXT: readonly ComponentTag[] = ['Caption', 'Label'];
const BODY_TEXT: readonly ComponentTag[] = ['Text'];
const INTERACTIVE: readonly ComponentTag[] = ['Button', 'IconButton', 'Input', 'Select', 'Switch'];

const isHeading = (t?: ComponentTag): boolean => t !== undefined && HEADINGS.includes(t);
const isSecondaryText = (t?: ComponentTag): boolean =>
  t !== undefined && SECONDARY_TEXT.includes(t);
const isBodyText = (t?: ComponentTag): boolean => t !== undefined && BODY_TEXT.includes(t);
const isInteractive = (t?: ComponentTag): boolean => t !== undefined && INTERACTIVE.includes(t);

// Heuristic rules, evaluated in order; the first match wins.
//
// 1. Heading directly above a Caption/Label is a "tight group" (eyebrow text) → tighter gap.
// 2. Heading above body text creates strong visual hierarchy → looser gap.
// 3. Body text following body text reads as continuous prose → tight gap.
// 4. A trailing interactive group (button row) after content gets the loose gap.
// 5. Anything → anything: base gap (the user-supplied value).
export function resolveGapRule(
  prev: ComponentTag | undefined,
  next: ComponentTag | undefined,
): GapRule {
  if (isHeading(prev) && isSecondaryText(next)) return 'tighter';
  if (isSecondaryText(prev) && isHeading(next)) return 'tighter';
  if (isHeading(prev) && isBodyText(next)) return 'loose';
  if (isBodyText(prev) && isBodyText(next)) return 'tight';
  if (!isInteractive(prev) && isInteractive(next)) return 'loose';
  return 'base';
}

export function resolveGapToken(base: SpaceToken | number, rule: GapRule): number {
  const baseValue = typeof base === 'number' ? base : space[base];
  return Math.round(baseValue * GAP_MULTIPLIER[rule]);
}
