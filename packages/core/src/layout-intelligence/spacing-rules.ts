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
// "Actions" are tappable commands (a button row). They are deliberately
// distinct from form *controls* (Input/Select/Switch/Checkbox/Radio): a
// trailing action after content should get extra separation, but stacked form
// controls should keep the base rhythm. Conflating the two (the previous
// `INTERACTIVE` set) made `Input → Button` resolve to `base` instead of
// `loose`, because the rule's `!isAction(prev)` guard saw the Input as an
// action and short-circuited.
const ACTIONS: readonly ComponentTag[] = ['Button', 'IconButton', 'FAB', 'ButtonGroup'];

const isHeading = (t?: ComponentTag): boolean => t !== undefined && HEADINGS.includes(t);
const isSecondaryText = (t?: ComponentTag): boolean =>
  t !== undefined && SECONDARY_TEXT.includes(t);
const isBodyText = (t?: ComponentTag): boolean => t !== undefined && BODY_TEXT.includes(t);
const isAction = (t?: ComponentTag): boolean => t !== undefined && ACTIONS.includes(t);

// Heuristic rules, evaluated in order; the first match wins.
//
// 1. Heading directly above a Caption/Label is a "tight group" (eyebrow text) → tighter gap.
//    (and the reverse: a Caption/Label eyebrow directly above a Heading)
// 2. Heading above body text creates strong visual hierarchy → looser gap.
// 3. Body text following body text reads as continuous prose → tight gap.
// 4. A trailing action (button row) after non-action content gets the loose gap.
//    Requires a real predecessor — a leading action with nothing before it
//    does not trigger this.
// 5. Anything → anything: base gap (the user-supplied value).
export function resolveGapRule(
  prev: ComponentTag | undefined,
  next: ComponentTag | undefined,
): GapRule {
  if (isHeading(prev) && isSecondaryText(next)) return 'tighter';
  if (isSecondaryText(prev) && isHeading(next)) return 'tighter';
  if (isHeading(prev) && isBodyText(next)) return 'loose';
  if (isBodyText(prev) && isBodyText(next)) return 'tight';
  if (prev !== undefined && !isAction(prev) && isAction(next)) return 'loose';
  return 'base';
}

export function resolveGapToken(base: SpaceToken | number, rule: GapRule): number {
  const baseValue = typeof base === 'number' ? base : space[base];
  return Math.round(baseValue * GAP_MULTIPLIER[rule]);
}
