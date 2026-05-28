import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

import { Card } from './Card';

export type KPIDeltaDirection = 'up' | 'down' | 'neutral';

export interface KPIDelta {
  readonly value: string;
  /** Direction drives the tone color: up = success, down = danger. */
  readonly direction?: KPIDeltaDirection;
}

export interface KPICardProps extends Omit<ViewProps, 'style'> {
  readonly label: string;
  readonly value: React.ReactNode;
  readonly delta?: KPIDelta;
  /** Optional leading icon node, rendered beside the label. */
  readonly icon?: React.ReactNode;
  readonly onPress?: () => void;
  readonly style?: StyleProp<ViewStyle>;
}

const HEADER_STYLE: ViewStyle = { flexDirection: 'row', alignItems: 'center' };

const KPICardImpl = React.forwardRef<View, KPICardProps>(function KPICard(props, ref) {
  const { label, value, delta, icon, onPress, style, ...rest } = props;
  const tokens = useTokens();
  const deltaTone =
    delta?.direction === 'up' ? 'success' : delta?.direction === 'down' ? 'danger' : 'muted';
  return (
    <Card
      ref={ref}
      density="comfortable"
      onPress={onPress}
      style={[{ gap: tokens.space['2xs'] }, style]}
      {...rest}
    >
      <View style={[HEADER_STYLE, { gap: tokens.space['2xs'] }]}>
        {icon ? <View>{icon}</View> : null}
        <Text variant="caption" tone="muted">
          {label}
        </Text>
      </View>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Heading level={3}>{value}</Heading>
      ) : (
        value
      )}
      {delta ? (
        <Text variant="caption" tone={deltaTone}>
          {delta.value}
        </Text>
      ) : null}
    </Card>
  );
});

KPICardImpl.displayName = 'KPICard';

export const KPICard = tagComponent(KPICardImpl, 'KPICard');
