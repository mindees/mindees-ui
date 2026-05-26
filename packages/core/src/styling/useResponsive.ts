import { useWindowDimensions } from 'react-native';

import { breakpoints, type BreakpointToken, type ResponsiveValue } from '@mindees/tokens';

const ORDERED_BREAKPOINTS: readonly BreakpointToken[] = [
  'xs',
  'sm',
  'md',
  'lg',
  'xl',
  '2xl',
] as const;

function isResponsiveMap<T>(
  value: ResponsiveValue<T>,
): value is Partial<Record<BreakpointToken, T>> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    ORDERED_BREAKPOINTS.some((bp) => bp in (value as Record<string, unknown>))
  );
}

/**
 * Pure resolver: given a `ResponsiveValue<T>` and a viewport width, return
 * the value at the largest breakpoint ≤ width. Scalar / non-map values are
 * returned unchanged. Pure-function for trivial unit testing.
 */
export function resolveResponsive<T>(value: ResponsiveValue<T>, width: number): T | undefined {
  if (!isResponsiveMap(value)) {
    return value as T;
  }
  let resolved: T | undefined;
  for (const bp of ORDERED_BREAKPOINTS) {
    if (width >= breakpoints[bp] && value[bp] !== undefined) {
      resolved = value[bp];
    }
  }
  return resolved;
}

/**
 * Hook variant: resolves against the current window width. Use the pure
 * `resolveResponsive(value, width)` directly when you have width measured
 * from elsewhere (e.g. a container ref).
 */
export function useResponsive<T>(value: ResponsiveValue<T>): T | undefined {
  const { width } = useWindowDimensions();
  return resolveResponsive(value, width);
}
