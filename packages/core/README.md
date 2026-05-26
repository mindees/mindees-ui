<p align="center">
  <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI" width="120" height="120" />
</p>

<h1 align="center">@mindees/ui</h1>

<p align="center">
  Universal React Native CLI + Expo component library with a deterministic <b>Layout Intelligence Layer</b>.
</p>

```sh
pnpm add @mindees/ui @mindees/tokens @mindees/icons
# plus peers:
pnpm add react-native-reanimated react-native-gesture-handler react-native-unistyles \
  react-native-nitro-modules react-native-edge-to-edge react-native-safe-area-context \
  react-native-svg @shopify/flash-list
```

Wrap your app:

```tsx
import { ThemeProvider, PortalProvider, ErrorBoundary } from '@mindees/ui';

export default function App() {
  return (
    <ThemeProvider mode="auto">
      <PortalProvider>
        <ErrorBoundary>{/* your app */}</ErrorBoundary>
      </PortalProvider>
    </ThemeProvider>
  );
}
```

Full docs: [mindees.dev](https://mindees.dev) · Source & roadmap: [github.com/mindees/mindees-ui](https://github.com/mindees/mindees-ui)

Compatible with Expo SDK 55 + 56 (RN 0.83 & 0.85), New Architecture only.
