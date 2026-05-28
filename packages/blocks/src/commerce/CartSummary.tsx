import { Button, Divider, HStack, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { formatCurrency } from './format';
import { type SummaryLine } from './types';

export interface CartSummaryProps {
  /** Summary rows (subtotal, shipping, tax, discounts, …). */
  readonly lines: readonly SummaryLine[];
  /** Final total, rendered emphasized below a divider. */
  readonly total: number;
  /** Label for the total row. Defaults to "Total". */
  readonly totalLabel?: string;
  /** ISO 4217 currency code for numeric values. Defaults to "USD". */
  readonly currency?: string;
  /** BCP-47 locale for formatting. */
  readonly locale?: string;
  /** Called when the checkout button is pressed. Omit to hide the button. */
  readonly onCheckout?: () => void;
  /** Checkout button label. Defaults to "Checkout". */
  readonly checkoutLabel?: string;
  /** Loading state for the checkout button. */
  readonly loading?: boolean;
  /** Disable the checkout button. */
  readonly disabled?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

interface SummaryRowProps {
  readonly line: SummaryLine;
  readonly currency: string;
  readonly locale: string | undefined;
}

const SummaryRow = React.memo(function SummaryRow({ line, currency, locale }: SummaryRowProps) {
  const value =
    typeof line.value === 'number' ? formatCurrency(line.value, currency, locale) : line.value;
  return (
    <HStack justify="space-between" align="center">
      <Text variant="bodySm" tone={line.emphasis ? 'success' : 'secondary'}>
        {line.label}
      </Text>
      <Text variant="bodySm" weight="medium" tone={line.emphasis ? 'success' : 'primary'}>
        {value}
      </Text>
    </HStack>
  );
});

const CartSummaryImpl = React.forwardRef<View, CartSummaryProps>(function CartSummary(props, ref) {
  const {
    lines,
    total,
    totalLabel = 'Total',
    currency = 'USD',
    locale,
    onCheckout,
    checkoutLabel = 'Checkout',
    loading = false,
    disabled = false,
    style,
  } = props;

  return (
    <VStack ref={ref} gap="sm" style={style}>
      {lines.map((line, index) => (
        <SummaryRow
          key={`${line.label}-${index}`}
          line={line}
          currency={currency}
          locale={locale}
        />
      ))}

      <Divider />

      <HStack justify="space-between" align="center">
        <Text variant="body" weight="semibold">
          {totalLabel}
        </Text>
        <Text variant="h5" weight="bold">
          {formatCurrency(total, currency, locale)}
        </Text>
      </HStack>

      {onCheckout ? (
        <Button onPress={onCheckout} loading={loading} disabled={disabled} fullWidth>
          {checkoutLabel}
        </Button>
      ) : null}
    </VStack>
  );
});

CartSummaryImpl.displayName = 'CartSummary';

export const CartSummary = React.memo(CartSummaryImpl);
