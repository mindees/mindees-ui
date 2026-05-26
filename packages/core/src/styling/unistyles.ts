// Module augmentation: tell Unistyles about *our* Theme so
// `StyleSheet.create((theme) => ...)` infers `theme.tokens.colors.*` etc.
// Side-effect imported by `configureUnistyles.ts` so the augmentation
// follows the runtime entry point into consumer tsconfigs.

import type { Theme } from '../theme/createTheme';

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: Theme;
    dark: Theme;
  }
}

// Marks this file as a module so TS treats the `declare module` block as
// an augmentation rather than a script with global declarations.
export {};
