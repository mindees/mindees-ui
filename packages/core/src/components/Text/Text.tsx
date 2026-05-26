import { type TextStyleName, type FontWeightToken, fontWeight } from '@mindees/tokens';
import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps, type TextStyle } from 'react-native';

import { tagComponent, type ComponentTag } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export type TextTone =
  | 'primary'
  | 'secondary'
  | 'muted'
  | 'inverse'
  | 'link'
  | 'onAccent'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info';

export interface TextOwnProps {
  /** Named text style from the modular type scale. Defaults to `body`. */
  readonly variant?: TextStyleName;
  readonly tone?: TextTone;
  readonly weight?: FontWeightToken;
  readonly align?: TextStyle['textAlign'];
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly strikethrough?: boolean;
  /** Override the family. Defaults to the theme's system font. */
  readonly fontFamily?: string;
}

export interface TextProps extends TextOwnProps, RNTextProps {
  readonly children?: React.ReactNode;
}

function resolveTone(tokens: ReturnType<typeof useTokens>, tone: TextTone): string {
  switch (tone) {
    case 'primary':
    case 'secondary':
    case 'muted':
    case 'inverse':
    case 'link':
    case 'onAccent':
      return tokens.colors.text[tone];
    case 'success':
      return tokens.colors.status.success;
    case 'danger':
      return tokens.colors.status.danger;
    case 'warning':
      return tokens.colors.status.warning;
    case 'info':
      return tokens.colors.status.info;
  }
}

function makeText(displayName: string, tag: ComponentTag, defaultVariant: TextStyleName) {
  const Impl = React.forwardRef<RNText, TextProps>(function Text(props, ref) {
    const {
      variant = defaultVariant,
      tone = 'primary',
      weight,
      align,
      italic,
      underline,
      strikethrough,
      fontFamily,
      style,
      children,
      ...rest
    } = props;
    const tokens = useTokens();
    const ts = tokens.textStyles[variant];

    const textStyle: TextStyle = {
      fontSize: ts.size,
      lineHeight: ts.lineHeight,
      fontWeight: (weight ? fontWeight[weight] : ts.weight) as TextStyle['fontWeight'],
      letterSpacing: ts.letterSpacing,
      color: resolveTone(tokens, tone),
    };
    if (align) textStyle.textAlign = align;
    if (italic) textStyle.fontStyle = 'italic';
    if (fontFamily) textStyle.fontFamily = fontFamily;
    if (underline || strikethrough) {
      textStyle.textDecorationLine =
        underline && strikethrough
          ? 'underline line-through'
          : underline
            ? 'underline'
            : 'line-through';
    }

    return (
      <RNText ref={ref} style={[textStyle, style]} {...rest}>
        {children}
      </RNText>
    );
  });
  Impl.displayName = displayName;
  return tagComponent(Impl, tag);
}

/** Body text (default `body` variant). Use `variant` to override. */
export const Text = makeText('Text', 'Text', 'body');
/** Auxiliary text. Smaller and more muted by default convention. */
export const Caption = makeText('Caption', 'Caption', 'caption');
/** Field labels and short emphatic tags. `tight` line-height. */
export const Label = makeText('Label', 'Label', 'label');
