import * as React from 'react';
import { Platform, type Text as RNText, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Text, type TextProps } from './Text';

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

export interface CodeProps extends Omit<TextProps, 'variant' | 'fontFamily'> {
  /** Wraps the text in a subtle-bg "pill" for inline code. Defaults to true. */
  readonly inline?: boolean;
}

const CodeImpl = React.forwardRef<RNText, CodeProps>(function Code(props, ref) {
  const { inline = true, style, children, ...rest } = props;
  const tokens = useTokens();
  if (!inline) {
    return (
      <Text ref={ref} variant="code" fontFamily={monoFamily} style={style} {...rest}>
        {children}
      </Text>
    );
  }
  const pillStyle: ViewStyle = {
    paddingHorizontal: tokens.space['2xs'],
    paddingVertical: 1,
    backgroundColor: tokens.colors.background.subtle,
    borderRadius: tokens.radii.sm,
  };
  return (
    <View style={pillStyle}>
      <Text ref={ref} variant="code" fontFamily={monoFamily} style={style} {...rest}>
        {children}
      </Text>
    </View>
  );
});

CodeImpl.displayName = 'Code';

export const Code = tagComponent(CodeImpl, 'Code');
