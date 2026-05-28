import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export type HelperTextProps = Omit<TextProps, 'variant'>;

/**
 * Small, muted helper text — the supporting line under a form field. Defaults
 * to the `caption` scale step with the `muted` tone.
 */
const HelperTextImpl = React.forwardRef<RNText, HelperTextProps>(function HelperText(props, ref) {
  const { tone = 'muted', children, ...rest } = props;
  return (
    <Text ref={ref} variant="caption" tone={tone} {...rest}>
      {children}
    </Text>
  );
});

HelperTextImpl.displayName = 'HelperText';

export const HelperText = tagComponent(React.memo(HelperTextImpl), 'HelperText');
