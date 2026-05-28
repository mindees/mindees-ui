// @testing-library/react-native v13+ ships its matchers built-in.
//
// Loaded via `setupFiles` (runs before the framework installs). `jest.mock`
// works at module load because the `jest` global is available.

// Reanimated worklets — the project's official Jest mock. Lazily applied: the
// factory only runs if something in the import graph requires reanimated.
jest.mock('react-native-reanimated', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-reanimated/mock'),
);

// Unistyles v3 reaches for native NitroModules at import time, which aren't
// present under Jest. Blocks tests load the full `@mindees/ui` barrel (mapped
// to core's source), whose `styling` module side-effect-imports Unistyles.
// Stub the only surface core touches: `StyleSheet.configure` (noop) and
// `StyleSheet.create` (identity passthrough — blocks render with plain RN
// styles + token props, so no real sheet resolution is needed).
jest.mock('react-native-unistyles', () => ({
  StyleSheet: {
    configure: (): void => undefined,
    create: <T>(styles: T): T => styles,
  },
  UnistylesRuntime: {},
}));
