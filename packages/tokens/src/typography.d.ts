export declare const fontSize: {
  readonly '2xs': 10;
  readonly xs: 12;
  readonly sm: 14;
  readonly md: 16;
  readonly lg: 18;
  readonly xl: 20;
  readonly '2xl': 24;
  readonly '3xl': 30;
  readonly '4xl': 36;
  readonly '5xl': 48;
  readonly '6xl': 60;
};
export type FontSizeToken = keyof typeof fontSize;
export declare const lineHeight: {
  readonly tight: 1.2;
  readonly snug: 1.35;
  readonly normal: 1.5;
  readonly relaxed: 1.7;
};
export type LineHeightToken = keyof typeof lineHeight;
export declare const fontWeight: {
  readonly regular: '400';
  readonly medium: '500';
  readonly semibold: '600';
  readonly bold: '700';
  readonly heavy: '800';
};
export type FontWeightToken = keyof typeof fontWeight;
export declare const letterSpacing: {
  readonly tight: -0.4;
  readonly normal: 0;
  readonly wide: 0.4;
  readonly wider: 0.8;
};
export type LetterSpacingToken = keyof typeof letterSpacing;
export declare const systemFont: string;
export declare const monospaceFont: string;
export interface TextStyleToken {
  readonly size: number;
  readonly lineHeight: number;
  readonly weight: (typeof fontWeight)[FontWeightToken];
  readonly letterSpacing: number;
}
export declare const textStyles: {
  readonly display: TextStyleToken;
  readonly h1: TextStyleToken;
  readonly h2: TextStyleToken;
  readonly h3: TextStyleToken;
  readonly h4: TextStyleToken;
  readonly h5: TextStyleToken;
  readonly h6: TextStyleToken;
  readonly bodyLg: TextStyleToken;
  readonly body: TextStyleToken;
  readonly bodySm: TextStyleToken;
  readonly label: TextStyleToken;
  readonly labelLg: TextStyleToken;
  readonly caption: TextStyleToken;
  readonly overline: TextStyleToken;
  readonly code: TextStyleToken;
};
export type TextStyleName = keyof typeof textStyles;
//# sourceMappingURL=typography.d.ts.map
