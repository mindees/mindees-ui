import * as React from 'react';
import type { Text as RNText, TextStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Text, type TextProps } from './Text';

export interface ParagraphProps extends TextProps {
  /** Omit the bottom margin (e.g. for the last paragraph in a block). */
  readonly noMargin?: boolean;
}

const ParagraphImpl = React.forwardRef<RNText, ParagraphProps>(function Paragraph(props, ref) {
  const { noMargin, variant = 'body', style, children, ...rest } = props;
  const tokens = useTokens();
  const blockStyle: TextStyle = { marginBottom: noMargin ? 0 : tokens.space.md };
  return (
    <Text ref={ref} variant={variant} style={[blockStyle, style]} {...rest}>
      {children}
    </Text>
  );
});

ParagraphImpl.displayName = 'Paragraph';

export const Paragraph = tagComponent(React.memo(ParagraphImpl), 'Paragraph');
