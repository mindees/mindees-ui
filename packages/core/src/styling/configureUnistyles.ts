import { StyleSheet } from 'react-native-unistyles';
import { breakpoints as defaultBreakpoints } from '@mindees/tokens';

import { darkTheme, lightTheme, type Theme } from '../theme/createTheme';
// Side-effect import: pulls the Unistyles module augmentation into the
// transitive import graph so consumers see our Theme typing on
// `StyleSheet.create((theme) => ...)`.
import './unistyles';

export interface ConfigureUnistylesInput {
  /** Pin custom themes. Falls back to MindeesUI's `light` + `dark` themes. */
  readonly themes?: { readonly light: Theme; readonly dark: Theme };
  /** Default `true` — follows the OS colour scheme automatically. */
  readonly adaptiveThemes?: boolean;
  /** Override breakpoint values. Defaults to `@mindees/tokens` breakpoints. */
  readonly breakpoints?: typeof defaultBreakpoints;
}

/**
 * Call once near your app root before any component renders. Wires up
 * Unistyles v3 with the library's themes + breakpoints so
 * `StyleSheet.create((theme) => ...)` resolves to a typed MindeesUI `Theme`.
 *
 * @example
 *   // App.tsx
 *   import { configureUnistyles } from '@mindees/ui';
 *   configureUnistyles();
 */
export function configureUnistyles(input: ConfigureUnistylesInput = {}): void {
  const themes = input.themes ?? { light: lightTheme, dark: darkTheme };
  const breakpoints = input.breakpoints ?? defaultBreakpoints;

  // Cast to the Unistyles config shape — its declared types use lazy / getter
  // fields we don't need to spell out at the public API surface. The
  // augmentation in `./unistyles` covers what consumers care about
  // (theme + breakpoint key inference inside `createStyles`).
  (StyleSheet.configure as unknown as (cfg: unknown) => void)({
    themes,
    breakpoints,
    settings: { adaptiveThemes: input.adaptiveThemes !== false },
  });
}
