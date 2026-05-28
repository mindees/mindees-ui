import { Badge, Box, Card, HStack, Image, Rating, Text, VStack, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { AddToCartButton } from './AddToCartButton';
import { PriceDisplay } from './PriceDisplay';
import { type Product } from './types';

export interface ProductCardProps {
  /** Product to render. */
  readonly product: Product;
  /** Called with the product when the add-to-cart button is pressed. */
  readonly onAddToCart?: (product: Product) => void;
  /** Called with the product when the card body is pressed. */
  readonly onPress?: (product: Product) => void;
  /** Hide the add-to-cart button (e.g. for a browse-only grid). */
  readonly hideAddToCart?: boolean;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  badge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
});

const ProductCardImpl = React.forwardRef<View, ProductCardProps>(function ProductCard(props, ref) {
  const { product, onAddToCart, onPress, hideAddToCart = false, style } = props;
  const tokens = useTokens();

  const handlePress = React.useCallback(() => {
    onPress?.(product);
  }, [onPress, product]);

  const handleAdd = React.useCallback(() => {
    onAddToCart?.(product);
  }, [onAddToCart, product]);

  const imageRadius: ViewStyle = { borderRadius: tokens.radii.md, overflow: 'hidden' };

  return (
    <Card
      ref={ref}
      density="compact"
      onPress={onPress ? handlePress : undefined}
      accessibilityLabel={product.title}
      style={style}
    >
      <VStack gap="xs">
        <Box style={imageRadius}>
          <Image
            src={product.image}
            resizeMode="cover"
            style={staticStyles.image}
            accessibilityLabel={product.title}
          />
          {product.badge ? (
            <Badge tone="primary" variant="solid" style={staticStyles.badge}>
              {product.badge}
            </Badge>
          ) : null}
        </Box>

        <Text variant="body" weight="medium" numberOfLines={2}>
          {product.title}
        </Text>

        {typeof product.rating === 'number' ? (
          <HStack gap="2xs" align="center">
            <Rating value={Math.round(product.rating)} readOnly size={14} />
            {typeof product.ratingCount === 'number' ? (
              <Text variant="caption" tone="muted">
                ({product.ratingCount})
              </Text>
            ) : null}
          </HStack>
        ) : null}

        <PriceDisplay
          price={product.price}
          compareAt={product.compareAt}
          currency={product.currency}
          size="h5"
        />

        {!hideAddToCart && onAddToCart ? (
          <AddToCartButton onAdd={handleAdd} label="Add to cart" />
        ) : null}
      </VStack>
    </Card>
  );
});

ProductCardImpl.displayName = 'ProductCard';

export const ProductCard = React.memo(ProductCardImpl);
