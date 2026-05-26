import { type SpaceToken, space } from '@mindees/tokens';
import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

export interface SpacerProps extends ViewProps {
  /** Fixed size in dp or named token. Omit for `flex: 1` (fills remaining space). */
  readonly size?: SpaceToken | number;
  /** Direction used when `size` is provided. Defaults to `vertical`. */
  readonly orientation?: 'horizontal' | 'vertical';
}

const SpacerImpl = React.forwardRef<View, SpacerProps>(function Spacer(props, ref) {
  const { size, orientation = 'vertical', style, ...rest } = props;
  const resolved = typeof size === 'number' ? size : size ? space[size] : undefined;

  const spacerStyle: ViewStyle =
    resolved === undefined
      ? { flexGrow: 1, flexShrink: 1 }
      : orientation === 'horizontal'
        ? { width: resolved }
        : { height: resolved };

  return <View ref={ref} pointerEvents="none" style={[spacerStyle, style]} {...rest} />;
});

SpacerImpl.displayName = 'Spacer';

export const Spacer = tagComponent(SpacerImpl, 'Spacer');
