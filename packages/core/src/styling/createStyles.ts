import { StyleSheet } from 'react-native-unistyles';

/**
 * Alias for Unistyles v3's `StyleSheet.create`, kept as a stable name we own
 * so apps don't depend directly on Unistyles' export shape. Pair with
 * `configureUnistyles()` near your app root.
 *
 * The MindeesUI `Theme` shape is wired into Unistyles via module augmentation
 * (`src/styling/unistyles.d.ts`), so `createStyles((theme) => ...)` autocompletes
 * `theme.tokens.colors`, `theme.tokens.space`, etc.
 *
 * @example
 * import { createStyles } from '@mindees/ui';
 *
 * const styles = createStyles((theme) => ({
 *   container: {
 *     padding: theme.tokens.space.md,
 *     backgroundColor: theme.tokens.colors.background.canvas,
 *     variants: {
 *       intent: {
 *         primary: { backgroundColor: theme.tokens.colors.action.primary },
 *         danger:  { backgroundColor: theme.tokens.colors.status.danger },
 *       },
 *     },
 *   },
 * }));
 */
// Explicit `typeof` annotation so the emitted .d.ts doesn't reference
// Unistyles' internal type-file paths (TS2742 "not portable" otherwise).
export const createStyles: typeof StyleSheet.create = StyleSheet.create;

// Re-export for advanced use (custom configure, useVariants on a sheet, etc.).
export { StyleSheet };
