import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export type ErrorTextProps = Omit<TextProps, 'variant' | 'tone'>;

/**
 * Small, danger-toned validation message. Announced by screen readers as an
 * assertive live region (`accessibilityLiveRegion` on Android, alert role on
 * iOS/web) so the error is read as soon as it appears.
 */
const ErrorTextImpl = React.forwardRef<RNText, ErrorTextProps>(function ErrorText(props, ref) {
  const {
    accessibilityLiveRegion = 'assertive',
    accessibilityRole = 'alert',
    children,
    ...rest
  } = props;
  return (
    <Text
      ref={ref}
      variant="caption"
      tone="danger"
      accessibilityLiveRegion={accessibilityLiveRegion}
      accessibilityRole={accessibilityRole}
      {...rest}
    >
      {children}
    </Text>
  );
});

ErrorTextImpl.displayName = 'ErrorText';

export const ErrorText = tagComponent(React.memo(ErrorTextImpl), 'ErrorText');
