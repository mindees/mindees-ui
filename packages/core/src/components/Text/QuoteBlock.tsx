import * as React from 'react';
import { View, type ViewStyle, type StyleProp } from 'react-native';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Text, type TextProps } from './Text';

export interface QuoteBlockProps extends Omit<TextProps, 'italic'> {
  /** Style applied to the bordered wrapper View. Caller value wins. */
  readonly containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Blockquote: an indented, italic passage with a left accent border. The
 * border uses the theme's brand action color so quotes pick up the app's
 * accent automatically.
 */
const QuoteBlockImpl = React.forwardRef<RNText, QuoteBlockProps>(function QuoteBlock(props, ref) {
  const { containerStyle, tone = 'secondary', style, children, ...rest } = props;
  const tokens = useTokens();
  const wrapperStyle: ViewStyle = {
    borderLeftWidth: 3,
    borderLeftColor: tokens.colors.action.primary,
    paddingLeft: tokens.space.md,
    paddingVertical: tokens.space.xs,
  };
  return (
    <View style={[wrapperStyle, containerStyle]}>
      <Text ref={ref} tone={tone} italic style={style} {...rest}>
        {children}
      </Text>
    </View>
  );
});

QuoteBlockImpl.displayName = 'QuoteBlock';

export const QuoteBlock = tagComponent(React.memo(QuoteBlockImpl), 'QuoteBlock');
