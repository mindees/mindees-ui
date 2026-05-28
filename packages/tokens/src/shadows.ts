import { Platform, type ViewStyle } from 'react-native';

// Cross-platform elevation. iOS uses shadow* props; Android uses `elevation`.
// We expose a unified `ShadowToken` and resolve at use site.

export interface ShadowSpec {
  readonly shadowColor: string;
  readonly shadowOffset: { readonly width: number; readonly height: number };
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly elevation: number;
}

const make = (height: number, radius: number, opacity: number, elevation: number): ShadowSpec => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

export const shadows = {
  none: make(0, 0, 0, 0),
  xs: make(1, 2, 0.06, 1),
  sm: make(2, 4, 0.08, 2),
  md: make(4, 8, 0.1, 4),
  lg: make(8, 16, 0.12, 8),
  xl: make(12, 24, 0.14, 12),
  '2xl': make(20, 40, 0.18, 20),
} as const;

export type ShadowToken = keyof typeof shadows;

// Resolves a token to platform-correct style props. Use this from components
// rather than spreading the spec directly so we can tune per-platform later.
//
// - Android: `elevation` (the iOS shadow* props are ignored by the platform).
// - Web (React Native Web): `boxShadow` — RNW does not implement the iOS
//   shadow* props, so without this branch every elevated surface renders flat.
// - iOS: the native shadow* props.
export const resolveShadow = (token: ShadowToken): ViewStyle => {
  const s = shadows[token];
  if (Platform.OS === 'android') {
    return { elevation: s.elevation };
  }
  if (Platform.OS === 'web') {
    if (token === 'none') return { boxShadow: 'none' };
    const { width, height } = s.shadowOffset;
    return {
      boxShadow: `${width}px ${height}px ${s.shadowRadius}px rgba(0, 0, 0, ${s.shadowOpacity})`,
    } as ViewStyle;
  }
  return {
    shadowColor: s.shadowColor,
    shadowOffset: s.shadowOffset,
    shadowOpacity: s.shadowOpacity,
    shadowRadius: s.shadowRadius,
  };
};
