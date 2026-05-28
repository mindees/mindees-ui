import { HStack, Text } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { DiscountBadge } from './DiscountBadge';
import { discountPercent, formatCurrency } from './format';

export interface PriceDisplayProps {
  /** Current selling price. */
  readonly price: number;
  /** Original / compare-at price. Renders struck-through when higher than `price`. */
  readonly compareAt?: number;
  /** ISO 4217 currency code. Defaults to "USD". */
  readonly currency?: string;
  /** BCP-47 locale for formatting. Defaults to the device locale. */
  readonly locale?: string;
  /** Show a discount percentage badge when a compare-at price applies. */
  readonly showDiscount?: boolean;
  /** Type scale for the current price. Defaults to "h4". */
  readonly size?: 'body' | 'bodyLg' | 'h5' | 'h4' | 'h3';
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const PriceDisplayImpl = React.forwardRef<View, PriceDisplayProps>(
  function PriceDisplay(props, ref) {
    const {
      price,
      compareAt,
      currency = 'USD',
      locale,
      showDiscount = true,
      size = 'h4',
      style,
    } = props;

    const formattedPrice = formatCurrency(price, currency, locale);
    const hasCompare = typeof compareAt === 'number' && compareAt > price;
    const percent = hasCompare ? discountPercent(price, compareAt) : 0;

    return (
      <HStack
        ref={ref}
        gap="xs"
        align="center"
        wrap
        accessibilityRole="text"
        accessibilityLabel={
          hasCompare
            ? `${formattedPrice}, was ${formatCurrency(compareAt, currency, locale)}`
            : formattedPrice
        }
        style={style}
      >
        <Text variant={size} weight="bold" tone="primary">
          {formattedPrice}
        </Text>
        {hasCompare ? (
          <Text variant="bodySm" tone="muted" strikethrough>
            {formatCurrency(compareAt, currency, locale)}
          </Text>
        ) : null}
        {showDiscount && percent > 0 ? <DiscountBadge percent={percent} /> : null}
      </HStack>
    );
  },
);

PriceDisplayImpl.displayName = 'PriceDisplay';

export const PriceDisplay = React.memo(PriceDisplayImpl);
