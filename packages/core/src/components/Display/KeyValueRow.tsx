import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface KeyValueRowProps extends Omit<ViewProps, 'style'> {
  /** Left-aligned label. */
  readonly label: React.ReactNode;
  /** Right-aligned value. */
  readonly value: React.ReactNode;
  /** Draw a bottom hairline divider. Defaults to false. */
  readonly divider?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const KeyValueRowImpl = React.forwardRef<View, KeyValueRowProps>(function KeyValueRow(props, ref) {
  const { label, value, divider = false, style, ...rest } = props;
  const tokens = useTokens();
  const rowStyle: ViewStyle = {
    paddingVertical: tokens.space.xs,
    gap: tokens.space.md,
    borderBottomWidth: divider ? 1 : 0,
    borderBottomColor: tokens.colors.border.subtle,
  };
  return (
    <View ref={ref} accessibilityRole="none" style={[ROW_STYLE, rowStyle, style]} {...rest}>
      {typeof label === 'string' ? (
        <Text variant="label" tone="muted" style={LABEL_STYLE}>
          {label}
        </Text>
      ) : (
        <View style={LABEL_STYLE}>{label}</View>
      )}
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text tone="primary" weight="medium" align="right" style={VALUE_STYLE}>
          {value}
        </Text>
      ) : (
        <View style={VALUE_WRAP_STYLE}>{value}</View>
      )}
    </View>
  );
});

const LABEL_STYLE = { flexShrink: 1 } as const;
const VALUE_STYLE = { flexShrink: 1, flexGrow: 1 } as const;
const VALUE_WRAP_STYLE: ViewStyle = { flexShrink: 1, alignItems: 'flex-end' };

KeyValueRowImpl.displayName = 'KeyValueRow';

export const KeyValueRow = tagComponent(KeyValueRowImpl, 'KeyValueRow');
