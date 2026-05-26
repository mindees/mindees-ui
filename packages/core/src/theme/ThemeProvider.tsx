import * as React from 'react';
import { AccessibilityInfo, Appearance, type ColorSchemeName as RNColorScheme } from 'react-native';

import {
  darkTheme,
  highContrastDarkTheme,
  highContrastLightTheme,
  lightTheme,
  type Theme,
} from './createTheme';

// Mode controls automatic dark-mode behaviour. `auto` follows the OS;
// otherwise the consumer pins it explicitly.
export type ThemeMode = 'auto' | 'light' | 'dark';

export interface ThemeProviderProps {
  readonly children: React.ReactNode;
  /** When `mode` is `auto`, switches between these. */
  readonly light?: Theme;
  readonly dark?: Theme;
  /** When `mode` is `auto` and the system reports high-contrast, use these instead. */
  readonly highContrastLight?: Theme;
  readonly highContrastDark?: Theme;
  readonly mode?: ThemeMode;
}

interface ThemeContextValue {
  readonly theme: Theme;
  readonly mode: ThemeMode;
  readonly setMode: (mode: ThemeMode) => void;
  readonly reduceMotion: boolean;
  readonly highContrast: boolean;
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({
  children,
  light = lightTheme,
  dark = darkTheme,
  highContrastLight = highContrastLightTheme,
  highContrastDark = highContrastDarkTheme,
  mode: modeProp = 'auto',
}: ThemeProviderProps): React.ReactElement {
  const [mode, setMode] = React.useState<ThemeMode>(modeProp);
  // RN's Appearance.getColorScheme() can return null *or* undefined depending
  // on the platform's headless / first-call state, so widen the state type.
  const [systemScheme, setSystemScheme] = React.useState<RNColorScheme | undefined>(
    () => Appearance.getColorScheme() ?? undefined,
  );
  const [reduceMotion, setReduceMotion] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);

  // Keep external `mode` prop authoritative if a parent explicitly toggles it.
  React.useEffect(() => {
    setMode(modeProp);
  }, [modeProp]);

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(({ colorScheme }) => setSystemScheme(colorScheme));
    return () => sub.remove();
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((v) => !cancelled && setReduceMotion(v))
      .catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduceMotion);
    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  // High-contrast detection. RN has no canonical API yet — iOS exposes it via
  // a darker-system-colors flag, Android via the "increase contrast" setting.
  // We probe the platform-specific signals we know about and fall back to false.
  React.useEffect(() => {
    const isDarkerSystemColorsEnabled = (
      AccessibilityInfo as unknown as { isDarkerSystemColorsEnabled?: () => Promise<boolean> }
    ).isDarkerSystemColorsEnabled;
    if (typeof isDarkerSystemColorsEnabled === 'function') {
      let cancelled = false;
      isDarkerSystemColorsEnabled()
        .then((v) => !cancelled && setHighContrast(v))
        .catch(() => undefined);
      return () => {
        cancelled = true;
      };
    }
    return undefined;
  }, []);

  const resolvedScheme: 'light' | 'dark' =
    mode === 'auto' ? (systemScheme === 'dark' ? 'dark' : 'light') : mode;

  const theme = React.useMemo(() => {
    if (highContrast) {
      return resolvedScheme === 'dark' ? highContrastDark : highContrastLight;
    }
    return resolvedScheme === 'dark' ? dark : light;
  }, [highContrast, resolvedScheme, light, dark, highContrastLight, highContrastDark]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({ theme, mode, setMode, reduceMotion, highContrast }),
    [theme, mode, reduceMotion, highContrast],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    // Returning a default theme rather than throwing keeps stories / isolated
    // components renderable without a provider. Documented in ARCHITECTURE.md.
    return lightTheme;
  }
  return ctx.theme;
}

export function useThemeContext(): ThemeContextValue {
  const ctx = React.useContext(ThemeContext);
  if (!ctx) {
    return {
      theme: lightTheme,
      mode: 'auto',
      setMode: () => undefined,
      reduceMotion: false,
      highContrast: false,
    };
  }
  return ctx;
}

export function useTokens(): Theme['tokens'] {
  return useTheme().tokens;
}

export function useReduceMotion(): boolean {
  return useThemeContext().reduceMotion;
}
