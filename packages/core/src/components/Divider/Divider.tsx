import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface DividerProps extends ViewProps {
  /** Defaults to `horizontal` (1-dp tall, full width). */
  readonly orientation?: 'horizontal' | 'vertical';
  /** Border colour key. Defaults to `border.subtle`. */
  readonly tone?: 'subtle' | 'default' | 'strong';
  /** Inset (start + end) from the parent edges, as a dp number. */
  readonly inset?: number;
  /** Override the line thickness in dp. Defaults to `StyleSheet.hairlineWidth` proxy of 1. */
  readonly thickness?: number;
}

const DividerImpl = React.forwardRef<View, DividerProps>(function Divider(props, ref) {
  const {
    orientation = 'horizontal',
    tone = 'subtle',
    inset = 0,
    thickness = 1,
    style,
    accessibilityRole = 'none',
    ...rest
  } = props;
  const tokens = useTokens();

  const dividerStyle: ViewStyle =
    orientation === 'horizontal'
      ? {
          height: thickness,
          alignSelf: 'stretch',
          marginHorizontal: inset,
          backgroundColor: tokens.colors.border[tone],
        }
      : {
          width: thickness,
          alignSelf: 'stretch',
          marginVertical: inset,
          backgroundColor: tokens.colors.border[tone],
        };

  return (
    <View ref={ref} accessibilityRole={accessibilityRole} style={[dividerStyle, style]} {...rest} />
  );
});

DividerImpl.displayName = 'Divider';

export const Divider = tagComponent(DividerImpl, 'Divider');
