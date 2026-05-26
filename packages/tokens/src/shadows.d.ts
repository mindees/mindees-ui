import { type ViewStyle } from 'react-native';
export interface ShadowSpec {
  readonly shadowColor: string;
  readonly shadowOffset: {
    readonly width: number;
    readonly height: number;
  };
  readonly shadowOpacity: number;
  readonly shadowRadius: number;
  readonly elevation: number;
}
export declare const shadows: {
  readonly none: ShadowSpec;
  readonly xs: ShadowSpec;
  readonly sm: ShadowSpec;
  readonly md: ShadowSpec;
  readonly lg: ShadowSpec;
  readonly xl: ShadowSpec;
  readonly '2xl': ShadowSpec;
};
export type ShadowToken = keyof typeof shadows;
export declare const resolveShadow: (token: ShadowToken) => ViewStyle;
//# sourceMappingURL=shadows.d.ts.map
