import { CloseIcon } from '@mindees/icons';
import { Box, HStack, IconButton, Image, Text, VStack, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { PriceDisplay } from './PriceDisplay';
import { QuantityStepper } from './QuantityStepper';
import { type CartLineItem } from './types';

export interface CartItemProps {
  /** Line item to render. */
  readonly item: CartLineItem;
  /** Called with the item id and new quantity when the stepper changes. */
  readonly onChangeQty?: (id: string, quantity: number) => void;
  /** Called with the item id when the remove control is pressed. */
  readonly onRemove?: (id: string) => void;
  /** Maximum selectable quantity. Defaults to 99. */
  readonly maxQuantity?: number;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  image: {
    width: 64,
    height: 64,
  },
  grow: { flex: 1 },
});

const CartItemImpl = React.forwardRef<View, CartItemProps>(function CartItem(props, ref) {
  const { item, onChangeQty, onRemove, maxQuantity = 99, style } = props;
  const tokens = useTokens();

  const handleChangeQty = React.useCallback(
    (quantity: number) => {
      onChangeQty?.(item.id, quantity);
    },
    [onChangeQty, item.id],
  );

  const handleRemove = React.useCallback(() => {
    onRemove?.(item.id);
  }, [onRemove, item.id]);

  const imageWrap: ViewStyle = {
    borderRadius: tokens.radii.md,
    overflow: 'hidden',
    backgroundColor: tokens.colors.background.subtle,
  };

  return (
    <HStack ref={ref} gap="sm" align="start" style={style}>
      <Box style={imageWrap}>
        <Image
          src={item.image}
          resizeMode="cover"
          style={staticStyles.image}
          accessibilityLabel={item.title}
        />
      </Box>

      <VStack gap="2xs" style={staticStyles.grow}>
        <Text variant="bodySm" weight="medium" numberOfLines={2}>
          {item.title}
        </Text>
        {item.variant ? (
          <Text variant="caption" tone="muted">
            {item.variant}
          </Text>
        ) : null}
        <PriceDisplay
          price={item.price}
          currency={item.currency}
          size="body"
          showDiscount={false}
        />
        <QuantityStepper
          value={item.quantity}
          onChange={handleChangeQty}
          max={maxQuantity}
          disabled={!onChangeQty}
        />
      </VStack>

      {onRemove ? (
        <IconButton
          accessibilityLabel={`Remove ${item.title}`}
          onPress={handleRemove}
          tone="neutral"
        >
          <CloseIcon size={18} color={tokens.colors.text.muted} />
        </IconButton>
      ) : null}
    </HStack>
  );
});

CartItemImpl.displayName = 'CartItem';

export const CartItem = React.memo(CartItemImpl);
