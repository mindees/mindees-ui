import '@testing-library/jest-native/extend-expect';

// React Native mocks for tests that don't need the native bridge
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}));

// Reanimated worklets — use the official mock
jest.mock('react-native-reanimated', () =>
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require('react-native-reanimated/mock'),
);

// Gesture Handler in tests
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
    gestureHandlerRootHOC: (x: unknown) => x,
  };
});

// Silence the legacy interop warning that fires inside RN test renderer
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const msg = String(args[0] ?? '');
    if (msg.includes('not wrapped in act')) return;
    originalError(...args);
  };
});
afterAll(() => {
  console.error = originalError;
});
