import { Badge, Box, Divider, HStack, Image, Rating, Text, VStack, useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  type View,
  type ViewStyle,
} from 'react-native';

import { AddToCartButton } from './AddToCartButton';
import { PriceDisplay } from './PriceDisplay';
import { type Product } from './types';

export interface ProductDetailsProps {
  /** Product to display. Uses `images` for the gallery, falling back to `image`. */
  readonly product: Product;
  /** Called with the chosen quantity when the user adds to cart. */
  readonly onAddToCart?: (product: Product, quantity: number) => void;
  /** Loading state for the add-to-cart action. */
  readonly addingToCart?: boolean;
  /** Maximum selectable quantity. Defaults to 99. */
  readonly maxQuantity?: number;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  heroImage: {
    width: '100%',
    aspectRatio: 1,
  },
  galleryImage: {
    width: 280,
    aspectRatio: 1,
  },
});

function galleryKeyExtractor(item: string, index: number): string {
  return `${item}-${index}`;
}

const ProductDetailsImpl = React.forwardRef<View, ProductDetailsProps>(
  function ProductDetails(props, ref) {
    const { product, onAddToCart, addingToCart = false, maxQuantity = 99, style } = props;
    const tokens = useTokens();

    const images = React.useMemo<readonly string[]>(() => {
      if (product.images && product.images.length > 0) return product.images;
      return product.image ? [product.image] : [];
    }, [product.images, product.image]);

    const handleAdd = React.useCallback(
      (quantity: number) => {
        onAddToCart?.(product, quantity);
      },
      [onAddToCart, product],
    );

    const galleryRadius = React.useMemo<ViewStyle>(
      () => ({ borderRadius: tokens.radii.lg, overflow: 'hidden' }),
      [tokens.radii.lg],
    );

    const renderGalleryItem = React.useCallback(
      ({ item }: ListRenderItemInfo<string>) => (
        <Box style={galleryRadius}>
          <Image
            src={item}
            resizeMode="cover"
            style={staticStyles.galleryImage}
            accessibilityLabel={product.title}
          />
        </Box>
      ),
      [galleryRadius, product.title],
    );

    const renderGallerySeparator = React.useCallback(
      () => <Box style={{ width: tokens.space.sm }} />,
      [tokens.space.sm],
    );

    return (
      <VStack ref={ref} gap="md" style={style}>
        {images.length > 1 ? (
          <FlatList
            data={images}
            horizontal
            keyExtractor={galleryKeyExtractor}
            renderItem={renderGalleryItem}
            ItemSeparatorComponent={renderGallerySeparator}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <Box style={galleryRadius}>
            <Image
              src={images[0]}
              resizeMode="cover"
              style={staticStyles.heroImage}
              accessibilityLabel={product.title}
            />
          </Box>
        )}

        <VStack gap="xs">
          {product.badge ? (
            <Badge tone="primary" variant="subtle">
              {product.badge}
            </Badge>
          ) : null}

          <Text variant="h3" weight="bold" accessibilityRole="header">
            {product.title}
          </Text>

          {typeof product.rating === 'number' ? (
            <HStack gap="2xs" align="center">
              <Rating value={Math.round(product.rating)} readOnly size={16} />
              {typeof product.ratingCount === 'number' ? (
                <Text variant="bodySm" tone="muted">
                  ({product.ratingCount} reviews)
                </Text>
              ) : null}
            </HStack>
          ) : null}

          <PriceDisplay
            price={product.price}
            compareAt={product.compareAt}
            currency={product.currency}
            size="h3"
          />
        </VStack>

        {product.description ? (
          <Text variant="body" tone="secondary">
            {product.description}
          </Text>
        ) : null}

        <Divider />

        <AddToCartButton
          onAdd={handleAdd}
          loading={addingToCart}
          showQuantity
          maxQuantity={maxQuantity}
        />
      </VStack>
    );
  },
);

ProductDetailsImpl.displayName = 'ProductDetails';

export const ProductDetails = React.memo(ProductDetailsImpl);
