import { Platform } from 'react-native';

// Type scale uses a 1.125 ratio (major second) for body sizes and 1.250
// (major third) at heading sizes. We name by t-shirt size, not by role,
// so the same scale serves Heading, Text, Label, and Caption uniformly.

export const fontSize = {
  '2xs': 10,
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
} as const;

export type FontSizeToken = keyof typeof fontSize;

// Line heights are unitless multipliers; multiplied by fontSize at render time.
// Tight = single-line UI text (buttons/labels). Snug = headings. Normal = body.
// Relaxed = long-form prose.
export const lineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.7,
} as const;

export type LineHeightToken = keyof typeof lineHeight;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
} as const;

export type FontWeightToken = keyof typeof fontWeight;

export const letterSpacing = {
  tight: -0.4,
  normal: 0,
  wide: 0.4,
  wider: 0.8,
} as const;

export type LetterSpacingToken = keyof typeof letterSpacing;

// Platform default font stacks. Components default to system fonts so apps
// look native out of the box. Custom fonts are loaded via Expo Font / RN
// asset linking and registered through ThemeProvider.
export const systemFont = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
});

export const monospaceFont = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

// Named text styles drive Heading/Text/Label/Caption components.
// Each one resolves to (size, lineHeight, weight, letterSpacing).
export interface TextStyleToken {
  readonly size: number;
  readonly lineHeight: number;
  readonly weight: (typeof fontWeight)[FontWeightToken];
  readonly letterSpacing: number;
}

const ts = (
  size: FontSizeToken,
  lh: LineHeightToken,
  weight: FontWeightToken,
  ls: LetterSpacingToken = 'normal',
): TextStyleToken => ({
  size: fontSize[size],
  lineHeight: Math.round(fontSize[size] * lineHeight[lh]),
  weight: fontWeight[weight],
  letterSpacing: letterSpacing[ls],
});

export const textStyles = {
  display: ts('5xl', 'tight', 'bold', 'tight'),
  h1: ts('4xl', 'snug', 'bold', 'tight'),
  h2: ts('3xl', 'snug', 'semibold', 'tight'),
  h3: ts('2xl', 'snug', 'semibold'),
  h4: ts('xl', 'snug', 'semibold'),
  h5: ts('lg', 'snug', 'semibold'),
  h6: ts('md', 'snug', 'semibold'),
  bodyLg: ts('lg', 'normal', 'regular'),
  body: ts('md', 'normal', 'regular'),
  bodySm: ts('sm', 'normal', 'regular'),
  label: ts('sm', 'tight', 'medium'),
  labelLg: ts('md', 'tight', 'medium'),
  caption: ts('xs', 'snug', 'regular'),
  overline: ts('xs', 'tight', 'semibold', 'wider'),
  code: ts('sm', 'normal', 'regular'),
} as const;

export type TextStyleName = keyof typeof textStyles;
