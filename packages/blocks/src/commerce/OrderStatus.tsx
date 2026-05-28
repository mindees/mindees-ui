import { Badge, Stepper, type StepperStep, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { type OrderStatusValue } from './types';

export interface OrderStatusProps {
  /** Current order status. Drives which step is active and the badge tone. */
  readonly status: OrderStatusValue;
  /**
   * Ordered fulfilment steps. Defaults to placed → processing → shipped →
   * delivered. Provide custom steps to localize or reshape the flow.
   */
  readonly steps?: readonly StepperStep[];
  /** Stepper orientation. Defaults to "horizontal". */
  readonly orientation?: 'horizontal' | 'vertical';
  /** Hide the status badge above the stepper. */
  readonly hideBadge?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_STEPS: readonly StepperStep[] = [
  { title: 'Placed' },
  { title: 'Processing' },
  { title: 'Shipped' },
  { title: 'Delivered' },
];

// Index into the default step flow for each terminal/active status.
const STATUS_INDEX: Record<OrderStatusValue, number> = {
  placed: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  cancelled: 0,
};

const BADGE_TONE: Record<OrderStatusValue, 'neutral' | 'info' | 'primary' | 'success' | 'danger'> =
  {
    placed: 'info',
    processing: 'primary',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
  };

const BADGE_LABEL: Record<OrderStatusValue, string> = {
  placed: 'Placed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const OrderStatusImpl = React.forwardRef<View, OrderStatusProps>(function OrderStatus(props, ref) {
  const { status, steps, orientation = 'horizontal', hideBadge = false, style } = props;

  const resolvedSteps = steps ?? DEFAULT_STEPS;
  const isCancelled = status === 'cancelled';

  // `current` is the active step index. For a delivered order all steps read as
  // done, so we point one past the last step.
  const current =
    status === 'delivered'
      ? resolvedSteps.length
      : steps
        ? Math.min(STATUS_INDEX[status], resolvedSteps.length - 1)
        : STATUS_INDEX[status];

  return (
    <VStack ref={ref} gap="sm" style={style}>
      {!hideBadge ? (
        <Badge tone={BADGE_TONE[status]} variant="subtle">
          {BADGE_LABEL[status]}
        </Badge>
      ) : null}
      {!isCancelled ? (
        <Stepper steps={resolvedSteps} current={current} orientation={orientation} />
      ) : null}
    </VStack>
  );
});

OrderStatusImpl.displayName = 'OrderStatus';

export const OrderStatus = React.memo(OrderStatusImpl);
