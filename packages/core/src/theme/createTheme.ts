import {
  breakpoints,
  densityScales,
  radii,
  shadows,
  semanticDark,
  semanticHighContrastDark,
  semanticHighContrastLight,
  semanticLight,
  space,
  textStyles,
  zIndex,
  duration,
  easing,
  type DensityMode,
  type SemanticColors,
} from '@mindees/tokens';

export type ColorSchemeName = 'light' | 'dark';
export type ContrastMode = 'normal' | 'high';

export interface ThemeTokens {
  readonly colors: SemanticColors;
  readonly space: typeof space;
  readonly radii: typeof radii;
  readonly shadows: typeof shadows;
  readonly textStyles: typeof textStyles;
  readonly breakpoints: typeof breakpoints;
  readonly zIndex: typeof zIndex;
  readonly duration: typeof duration;
  readonly easing: typeof easing;
}

export interface Theme {
  readonly name: string;
  readonly colorScheme: ColorSchemeName;
  readonly contrast: ContrastMode;
  readonly density: DensityMode;
  readonly tokens: ThemeTokens;
}

export interface CreateThemeInput {
  readonly name: string;
  readonly colorScheme: ColorSchemeName;
  readonly contrast?: ContrastMode;
  readonly density?: DensityMode;
  readonly colors?: Partial<SemanticColors>;
}

// Deep-merge semantic color overrides without mutating the base.
function mergeColors(base: SemanticColors, overrides?: Partial<SemanticColors>): SemanticColors {
  if (!overrides) return base;
  return {
    background: { ...base.background, ...overrides.background },
    text: { ...base.text, ...overrides.text },
    border: { ...base.border, ...overrides.border },
    action: { ...base.action, ...overrides.action },
    status: { ...base.status, ...overrides.status },
    overlay: { ...base.overlay, ...overrides.overlay },
  };
}

function pickBaseSemantic(scheme: ColorSchemeName, contrast: ContrastMode): SemanticColors {
  if (contrast === 'high') {
    return scheme === 'light' ? semanticHighContrastLight : semanticHighContrastDark;
  }
  return scheme === 'light' ? semanticLight : semanticDark;
}

export function createTheme(input: CreateThemeInput): Theme {
  const contrast = input.contrast ?? 'normal';
  const density = input.density ?? 'comfortable';
  const baseColors = pickBaseSemantic(input.colorScheme, contrast);
  const colors = mergeColors(baseColors, input.colors);
  const _density = densityScales[density]; // reserved for spacing-scale derivation
  void _density;
  return {
    name: input.name,
    colorScheme: input.colorScheme,
    contrast,
    density,
    tokens: {
      colors,
      space,
      radii,
      shadows,
      textStyles,
      breakpoints,
      zIndex,
      duration,
      easing,
    },
  };
}

// Default themes shipped with the library — apps can use these as-is or call
// `createTheme` to derive their own.
export const lightTheme: Theme = createTheme({ name: 'light', colorScheme: 'light' });
export const darkTheme: Theme = createTheme({ name: 'dark', colorScheme: 'dark' });
export const highContrastLightTheme: Theme = createTheme({
  name: 'high-contrast-light',
  colorScheme: 'light',
  contrast: 'high',
});
export const highContrastDarkTheme: Theme = createTheme({
  name: 'high-contrast-dark',
  colorScheme: 'dark',
  contrast: 'high',
});
