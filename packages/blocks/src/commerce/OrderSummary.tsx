import { Divider, HStack, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { formatCurrency } from './format';
import { type OrderLineItem, type SummaryLine } from './types';

export interface OrderSummaryProps {
  /** Read-only order line items. */
  readonly items: readonly OrderLineItem[];
  /** Order total, rendered emphasized. */
  readonly total: number;
  /** Optional extra summary rows (shipping, tax, discounts) above the total. */
  readonly lines?: readonly SummaryLine[];
  /** Optional heading. */
  readonly title?: string;
  /** Label for the total row. Defaults to "Total". */
  readonly totalLabel?: string;
  /** ISO 4217 currency code. Defaults to "USD". */
  readonly currency?: string;
  /** BCP-47 locale for formatting. */
  readonly locale?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const OrderSummaryImpl = React.forwardRef<View, OrderSummaryProps>(
  function OrderSummary(props, ref) {
    const {
      items,
      total,
      lines,
      title,
      totalLabel = 'Total',
      currency = 'USD',
      locale,
      style,
    } = props;

    return (
      <VStack ref={ref} gap="sm" style={style}>
        {title ? (
          <Text variant="h5" weight="semibold" accessibilityRole="header">
            {title}
          </Text>
        ) : null}

        {items.map((item, index) => (
          <HStack
            key={item.id ?? `${item.title}-${index}`}
            justify="space-between"
            align="start"
            gap="sm"
          >
            <Text variant="bodySm" tone="secondary" style={GROW_STYLE} numberOfLines={2}>
              {item.quantity > 1 ? `${item.quantity} × ` : ''}
              {item.title}
            </Text>
            <Text variant="bodySm" weight="medium">
              {formatCurrency(item.price * item.quantity, item.currency ?? currency, locale)}
            </Text>
          </HStack>
        ))}

        {lines && lines.length > 0 ? (
          <>
            <Divider />
            {lines.map((line, index) => (
              <HStack key={`${line.label}-${index}`} justify="space-between" align="center">
                <Text variant="bodySm" tone={line.emphasis ? 'success' : 'muted'}>
                  {line.label}
                </Text>
                <Text variant="bodySm" tone={line.emphasis ? 'success' : 'secondary'}>
                  {typeof line.value === 'number'
                    ? formatCurrency(line.value, currency, locale)
                    : line.value}
                </Text>
              </HStack>
            ))}
          </>
        ) : null}

        <Divider />

        <HStack justify="space-between" align="center">
          <Text variant="body" weight="semibold">
            {totalLabel}
          </Text>
          <Text variant="h5" weight="bold">
            {formatCurrency(total, currency, locale)}
          </Text>
        </HStack>
      </VStack>
    );
  },
);

const GROW_STYLE: ViewStyle = { flex: 1 };

OrderSummaryImpl.displayName = 'OrderSummary';

export const OrderSummary = React.memo(OrderSummaryImpl);
