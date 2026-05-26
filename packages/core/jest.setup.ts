// jest-native's `extend-expect` is deprecated; @testing-library/react-native
// v13+ ships its matchers built-in, so the import is no longer required.
//
// This file is loaded via `setupFiles`, which runs *before* the testing
// framework is installed — Jest globals like `beforeAll` are not yet defined
// here, but `jest.mock(...)` works because the `jest` global is available
// from module load.

// Reanimated worklets — the project's official Jest mock.
jest.mock('react-native-reanimated', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-reanimated/mock'),
);

// Gesture Handler — replace with plain Views so tree rendering doesn't need
// any native handlers.
jest.mock('react-native-gesture-handler', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const View = require('react-native').View;
  return {
    GestureHandlerRootView: View,
    PanGestureHandler: View,
    TapGestureHandler: View,
    LongPressGestureHandler: View,
    State: {},
    Directions: {},
    gestureHandlerRootHOC: <T>(x: T): T => x,
  };
});
