import * as React from 'react';

import { getComponentTag, type ComponentTag } from './tagged-component';

// Collapse fragments and arrays into a flat list of valid elements. Filters
// out the falsy values React permits in children (false, null, undefined, '').
export function flattenChildren(children: React.ReactNode): React.ReactElement[] {
  const out: React.ReactElement[] = [];
  const walk = (node: React.ReactNode): void => {
    if (node === null || node === undefined || node === false || node === true) return;
    if (typeof node === 'string' || typeof node === 'number') return;
    if (Array.isArray(node)) {
      for (const c of node) walk(c);
      return;
    }
    if (React.isValidElement(node)) {
      if (node.type === React.Fragment) {
        walk((node.props as { children?: React.ReactNode }).children);
        return;
      }
      out.push(node);
    }
  };
  walk(children);
  return out;
}

export interface ChildSlot {
  readonly element: React.ReactElement;
  readonly tag: ComponentTag | undefined;
  readonly index: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
}

// Build a positional slot record for every flattened child. Useful for
// compound components (ButtonGroup, List) that need to know each child's
// boundary position to round outer corners / hide last divider / etc.
export function describeChildren(children: React.ReactNode): ChildSlot[] {
  const flat = flattenChildren(children);
  const lastIndex = flat.length - 1;
  return flat.map((element, index) => ({
    element,
    tag: getComponentTag(element),
    index,
    isFirst: index === 0,
    isLast: index === lastIndex,
  }));
}

export function findFirstByTag(
  children: React.ReactNode,
  tag: ComponentTag,
): React.ReactElement | undefined {
  for (const slot of describeChildren(children)) {
    if (slot.tag === tag) return slot.element;
  }
  return undefined;
}

export function countByTag(children: React.ReactNode): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const slot of describeChildren(children)) {
    const key = slot.tag ?? '__untagged__';
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
}
