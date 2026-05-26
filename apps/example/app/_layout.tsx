import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary, PortalProvider, ThemeProvider } from '@mindees/ui';

export default function RootLayout(): React.ReactElement {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider mode="auto">
          <PortalProvider>
            <ErrorBoundary>
              <Stack screenOptions={{ headerShown: true, title: 'MindeesUI' }} />
            </ErrorBoundary>
          </PortalProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
