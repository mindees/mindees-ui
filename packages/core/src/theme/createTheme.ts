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

import { darken, lighten, readableTextOn } from './color-utils';

export type ColorSchemeName = 'light' | 'dark';
export type ContrastMode = 'normal' | 'high';

/** Recursively-optional version of T — lets a consumer override just
 * `action.primary` without re-specifying the other slots. */
export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

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

/** Non-color token overrides — shared across light/dark. */
export interface TokenOverrides {
  readonly space?: Partial<typeof space>;
  readonly radii?: Partial<typeof radii>;
  readonly shadows?: Partial<typeof shadows>;
  readonly textStyles?: Partial<typeof textStyles>;
  readonly breakpoints?: Partial<typeof breakpoints>;
  readonly zIndex?: Partial<typeof zIndex>;
  readonly duration?: Partial<typeof duration>;
  readonly easing?: Partial<typeof easing>;
}

export interface CreateThemeInput extends TokenOverrides {
  readonly name: string;
  readonly colorScheme: ColorSchemeName;
  readonly contrast?: ContrastMode;
  readonly density?: DensityMode;
  readonly colors?: DeepPartial<SemanticColors>;
}

// Deep-merge semantic color overrides without mutating the base.
function mergeColors(
  base: SemanticColors,
  overrides?: DeepPartial<SemanticColors>,
): SemanticColors {
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

// Density scales the spacing rhythm without changing the design language.
// Values are rounded to the nearest 2 so the result stays on the grid.
function scaleSpace(multiplier: number): typeof space {
  if (multiplier === 1) return space;
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(space)) {
    out[key] = value === 0 ? 0 : Math.max(2, Math.round((value * multiplier) / 2) * 2);
  }
  return out as typeof space;
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
  const scaledSpace = scaleSpace(densityScales[density].spaceMultiplier);
  return {
    name: input.name,
    colorScheme: input.colorScheme,
    contrast,
    density,
    tokens: {
      colors,
      space: { ...scaledSpace, ...input.space } as typeof space,
      radii: { ...radii, ...input.radii } as typeof radii,
      shadows: { ...shadows, ...input.shadows } as typeof shadows,
      textStyles: { ...textStyles, ...input.textStyles } as typeof textStyles,
      breakpoints: { ...breakpoints, ...input.breakpoints } as typeof breakpoints,
      zIndex: { ...zIndex, ...input.zIndex } as typeof zIndex,
      duration: { ...duration, ...input.duration } as typeof duration,
      easing: { ...easing, ...input.easing } as typeof easing,
    },
  };
}

// ---------------------------------------------------------------------------
// Easy theming: recolor your whole app from a handful of brand colors.
// ---------------------------------------------------------------------------

/** The colors an ordinary user changes to rebrand the app. Only `brand` is
 * required — everything else has a sensible default derived from it or from
 * the built-in palette. */
export interface ThemeColorConfig {
  /** Accent/brand color — drives buttons, links, focus rings, selected states.
   * Hover/active shades and a readable on-accent text color are derived for you. */
  readonly brand: string;
  /** Optional status overrides; default to the built-in green/red/orange. */
  readonly success?: string;
  readonly danger?: string;
  readonly warning?: string;
  readonly info?: string;
  /** Power-user escape hatch: override any semantic slot directly. */
  readonly colors?: DeepPartial<SemanticColors>;
}

export interface CreateThemesInput extends TokenOverrides {
  readonly name?: string;
  readonly light: ThemeColorConfig;
  readonly dark: ThemeColorConfig;
  readonly contrast?: ContrastMode;
  readonly density?: DensityMode;
}

// Derive the accent-related semantic slots from one brand color.
// Hover/active darken on light schemes and lighten on dark schemes so the
// pressed state always moves toward higher contrast against the surface.
function deriveAccent(scheme: ColorSchemeName, cfg: ThemeColorConfig): DeepPartial<SemanticColors> {
  const shift = scheme === 'light' ? darken : lighten;
  const subtle = scheme === 'light' ? lighten : darken;
  const onAccent = readableTextOn(cfg.brand);
  const info = cfg.info ?? cfg.brand;
  return {
    action: {
      primary: cfg.brand,
      primaryHover: shift(cfg.brand, 0.12),
      primaryActive: shift(cfg.brand, 0.22),
    },
    text: { link: cfg.brand, onAccent },
    border: { focus: cfg.brand },
    status: {
      info,
      infoSubtle: subtle(info, 0.85),
      ...(cfg.success ? { success: cfg.success, successSubtle: subtle(cfg.success, 0.85) } : {}),
      ...(cfg.danger ? { danger: cfg.danger, dangerSubtle: subtle(cfg.danger, 0.85) } : {}),
      ...(cfg.warning ? { warning: cfg.warning, warningSubtle: subtle(cfg.warning, 0.85) } : {}),
    },
  };
}

function combineColors(
  a: DeepPartial<SemanticColors>,
  b?: DeepPartial<SemanticColors>,
): DeepPartial<SemanticColors> {
  return {
    background: { ...a.background, ...b?.background },
    text: { ...a.text, ...b?.text },
    border: { ...a.border, ...b?.border },
    action: { ...a.action, ...b?.action },
    status: { ...a.status, ...b?.status },
    overlay: { ...a.overlay, ...b?.overlay },
  };
}

/**
 * Generate a matched light + dark theme pair from a few brand colors.
 *
 * The easiest way to rebrand a MindeesUI app: copy `themeTemplate`, change the
 * `brand` colors for light and dark, and pass the result to `ThemeProvider`.
 *
 * ```tsx
 * const { light, dark } = createThemes({
 *   name: 'acme',
 *   light: { brand: '#6d28d9' },
 *   dark: { brand: '#a78bfa' },
 * });
 * <ThemeProvider light={light} dark={dark}>...</ThemeProvider>
 * ```
 */
export function createThemes(input: CreateThemesInput): { light: Theme; dark: Theme } {
  const base = input.name ?? 'custom';
  const tokenOverrides: TokenOverrides = {
    space: input.space,
    radii: input.radii,
    shadows: input.shadows,
    textStyles: input.textStyles,
    breakpoints: input.breakpoints,
    zIndex: input.zIndex,
    duration: input.duration,
    easing: input.easing,
  };
  const build = (scheme: ColorSchemeName): Theme => {
    const cfg = scheme === 'light' ? input.light : input.dark;
    const colors = combineColors(deriveAccent(scheme, cfg), cfg.colors);
    return createTheme({
      name: `${base}-${scheme}`,
      colorScheme: scheme,
      contrast: input.contrast,
      density: input.density,
      colors,
      ...tokenOverrides,
    });
  };
  return { light: build('light'), dark: build('dark') };
}

/**
 * Copy this, change the brand colors, and you have a fully rebranded app.
 * Everything else (text, surfaces, borders, hover/active states, on-accent
 * text) is derived automatically and stays accessible.
 */
export const themeTemplate: CreateThemesInput = {
  name: 'my-app',
  light: {
    brand: '#0090ff',
    success: '#30a46c',
    danger: '#e5484d',
    warning: '#f76b15',
  },
  dark: {
    brand: '#3b9eff',
    success: '#33b074',
    danger: '#ec5d5e',
    warning: '#ff801f',
  },
};

// Default themes shipped with the library — apps can use these as-is or call
// `createTheme` / `createThemes` to derive their own.
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
