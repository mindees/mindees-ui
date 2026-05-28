import * as React from 'react';
import type { Text as RNText, TextStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Text, type TextProps } from './Text';

export type MarkProps = TextProps;

/**
 * Inline highlighted text (the `<mark>` analogue). Paints a subtle warning-toned
 * highlight behind the text — useful for search-term and token highlighting.
 */
const MarkImpl = React.forwardRef<RNText, MarkProps>(function Mark(props, ref) {
  const { style, children, ...rest } = props;
  const tokens = useTokens();
  const highlightStyle: TextStyle = { backgroundColor: tokens.colors.status.warningSubtle };
  return (
    <Text ref={ref} style={[highlightStyle, style]} {...rest}>
      {children}
    </Text>
  );
});

MarkImpl.displayName = 'Mark';

export const Mark = tagComponent(React.memo(MarkImpl), 'Mark');
