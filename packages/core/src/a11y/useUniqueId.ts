import { useId } from 'react';

/**
 * Stable, render-safe unique id for accessibility wiring (`nativeID`,
 * `accessibilityLabelledBy`, etc.). Wraps React 19's `useId` so we control
 * the prefix and sanitise the colons/double-quotes that some platforms
 * reject inside ids.
 */
export function useUniqueId(prefix = 'mindees'): string {
  const id = useId();
  // React's useId produces `:r1:`-style strings; native id attributes
  // can't contain colons on some platforms. Strip non-alphanumeric.
  const sanitised = id.replace(/[^a-zA-Z0-9]/g, '');
  return `${prefix}-${sanitised}`;
}
