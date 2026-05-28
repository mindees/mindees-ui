import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

export interface StatProps extends Omit<ViewProps, 'style'> {
  readonly label: string;
  readonly value: React.ReactNode;
  readonly delta?: { readonly value: string; readonly tone?: 'success' | 'danger' | 'muted' };
  readonly description?: string;
  readonly style?: StyleProp<ViewStyle>;
}

const StatImpl = React.forwardRef<View, StatProps>(function Stat(props, ref) {
  const { label, value, delta, description, style, ...rest } = props;
  const tokens = useTokens();
  return (
    <View
      ref={ref}
      accessibilityRole="none"
      style={[{ gap: tokens.space['3xs'] }, style]}
      {...rest}
    >
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      {typeof value === 'string' ? <Heading level={3}>{value}</Heading> : value}
      {delta ? (
        <Text variant="caption" tone={delta.tone ?? 'muted'}>
          {delta.value}
        </Text>
      ) : null}
      {description ? (
        <Text variant="caption" tone="muted">
          {description}
        </Text>
      ) : null}
    </View>
  );
});

StatImpl.displayName = 'Stat';

export const Stat = tagComponent(StatImpl, 'Stat');
