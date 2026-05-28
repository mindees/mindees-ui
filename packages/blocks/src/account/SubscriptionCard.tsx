import { Badge, Button, Caption, Card, Heading, HStack, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** The subscription plan rendered by SubscriptionCard. */
export interface SubscriptionPlan {
  /** Plan name, e.g. "Pro". */
  readonly name: string;
  /** Pre-formatted price, e.g. "$12 / mo". */
  readonly price: string;
  /** Pre-formatted renewal date, e.g. "Renews Jun 12, 2026". */
  readonly renewalDate?: string;
  /** Optional short status, e.g. "Active" or "Trial". */
  readonly status?: string;
  /** Tone for the status badge. Defaults to "success". */
  readonly statusTone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export interface SubscriptionCardProps {
  /** Plan to render. */
  readonly plan: SubscriptionPlan;
  /** Shows the manage/upgrade button when provided. */
  readonly onManage?: () => void;
  /** Label for the action button. Defaults to "Manage plan". */
  readonly manageLabel?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  header: { alignItems: 'center' },
  manage: { alignSelf: 'flex-start' },
});

const SubscriptionCardImpl = React.forwardRef<View, SubscriptionCardProps>(
  function SubscriptionCard(props, ref) {
    const { plan, onManage, manageLabel = 'Manage plan', style } = props;

    return (
      <Card ref={ref} style={style}>
        <VStack gap="md">
          <HStack gap="sm" justify="space-between" style={staticStyles.header}>
            <Heading level={4}>{plan.name}</Heading>
            {plan.status ? (
              <Badge tone={plan.statusTone ?? 'success'} variant="subtle">
                {plan.status}
              </Badge>
            ) : null}
          </HStack>

          <VStack gap="3xs">
            <Text variant="h5" weight="semibold">
              {plan.price}
            </Text>
            {plan.renewalDate ? <Caption tone="muted">{plan.renewalDate}</Caption> : null}
          </VStack>

          {onManage ? (
            <Button variant="solid" tone="primary" onPress={onManage} style={staticStyles.manage}>
              {manageLabel}
            </Button>
          ) : null}
        </VStack>
      </Card>
    );
  },
);

SubscriptionCardImpl.displayName = 'SubscriptionCard';

export const SubscriptionCard = React.memo(SubscriptionCardImpl);
