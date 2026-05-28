import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export type TruncatedTextProps = TextProps;

/**
 * Single-purpose Text that truncates to `numberOfLines` (default 1) with a
 * tail ellipsis. Pass `numberOfLines` and `ellipsizeMode` to override.
 */
const TruncatedTextImpl = React.forwardRef<RNText, TruncatedTextProps>(
  function TruncatedText(props, ref) {
    const { numberOfLines = 1, ellipsizeMode = 'tail', children, ...rest } = props;
    return (
      <Text ref={ref} numberOfLines={numberOfLines} ellipsizeMode={ellipsizeMode} {...rest}>
        {children}
      </Text>
    );
  },
);

TruncatedTextImpl.displayName = 'TruncatedText';

export const TruncatedText = tagComponent(React.memo(TruncatedTextImpl), 'TruncatedText');
