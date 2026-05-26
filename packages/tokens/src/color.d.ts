export type ColorScale = readonly [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];
export declare const grayLight: ColorScale;
export declare const grayDark: ColorScale;
export declare const blueLight: ColorScale;
export declare const blueDark: ColorScale;
export declare const greenLight: ColorScale;
export declare const greenDark: ColorScale;
export declare const redLight: ColorScale;
export declare const redDark: ColorScale;
export declare const yellowLight: ColorScale;
export declare const yellowDark: ColorScale;
export declare const orangeLight: ColorScale;
export declare const orangeDark: ColorScale;
export interface PaletteScales {
  readonly gray: ColorScale;
  readonly blue: ColorScale;
  readonly green: ColorScale;
  readonly red: ColorScale;
  readonly yellow: ColorScale;
  readonly orange: ColorScale;
}
export declare const lightPalette: PaletteScales;
export declare const darkPalette: PaletteScales;
export interface SemanticColors {
  readonly background: {
    readonly canvas: string;
    readonly surface: string;
    readonly subtle: string;
    readonly elevated: string;
    readonly inverse: string;
  };
  readonly text: {
    readonly primary: string;
    readonly secondary: string;
    readonly muted: string;
    readonly inverse: string;
    readonly link: string;
    readonly onAccent: string;
  };
  readonly border: {
    readonly subtle: string;
    readonly default: string;
    readonly strong: string;
    readonly focus: string;
  };
  readonly action: {
    readonly primary: string;
    readonly primaryHover: string;
    readonly primaryActive: string;
    readonly primaryDisabled: string;
    readonly secondary: string;
    readonly secondaryHover: string;
    readonly secondaryActive: string;
    readonly secondaryDisabled: string;
  };
  readonly status: {
    readonly success: string;
    readonly successSubtle: string;
    readonly danger: string;
    readonly dangerSubtle: string;
    readonly warning: string;
    readonly warningSubtle: string;
    readonly info: string;
    readonly infoSubtle: string;
  };
  readonly overlay: {
    readonly scrim: string;
    readonly scrimStrong: string;
  };
}
export declare const semanticLight: SemanticColors;
export declare const semanticDark: SemanticColors;
export declare const semanticHighContrastLight: SemanticColors;
export declare const semanticHighContrastDark: SemanticColors;
//# sourceMappingURL=color.d.ts.map
