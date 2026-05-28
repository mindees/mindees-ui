import { useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { ProductCard } from './ProductCard';
import { type Product } from './types';

export interface ProductGridProps {
  /** Products to render. */
  readonly products: readonly Product[];
  /** Number of columns. Defaults to 2. */
  readonly numColumns?: number;
  /** Called with the product when a card is pressed. */
  readonly onPressProduct?: (product: Product) => void;
  /** Called with the product when a card's add-to-cart button is pressed. */
  readonly onAddToCart?: (product: Product) => void;
  /** Hide the add-to-cart button on every card. */
  readonly hideAddToCart?: boolean;
  /** Rendered when `products` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Header slot rendered above the grid. */
  readonly ListHeaderComponent?: React.ComponentProps<typeof FlatList>['ListHeaderComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the FlatList container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  cell: { flex: 1 },
});

function keyExtractor(item: Product, index: number): string {
  return item.id ?? `${item.title}-${index}`;
}

const ProductGridImpl = React.forwardRef<FlatList<Product>, ProductGridProps>(
  function ProductGrid(props, ref) {
    const {
      products,
      numColumns = 2,
      onPressProduct,
      onAddToCart,
      hideAddToCart = false,
      ListEmptyComponent,
      ListHeaderComponent,
      scrollEnabled = true,
      style,
    } = props;
    const tokens = useTokens();

    const gap = tokens.space.sm;

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<Product>) => (
        <View style={staticStyles.cell}>
          <ProductCard
            product={item}
            onPress={onPressProduct}
            onAddToCart={onAddToCart}
            hideAddToCart={hideAddToCart}
          />
        </View>
      ),
      [onPressProduct, onAddToCart, hideAddToCart],
    );

    // Column gutters via `columnWrapperStyle`; row gutters via item separators
    // keep cells edge-aligned without per-cell margin math.
    const columnWrapperStyle = React.useMemo<ViewStyle | undefined>(
      () => (numColumns > 1 ? { gap } : undefined),
      [numColumns, gap],
    );

    const renderSeparator = React.useCallback(() => <View style={{ height: gap }} />, [gap]);

    return (
      <FlatList
        ref={ref}
        data={products}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={numColumns}
        columnWrapperStyle={columnWrapperStyle}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={ListEmptyComponent}
        ListHeaderComponent={ListHeaderComponent}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        style={style}
        // `numColumns` is fixed per render; remounting on change is correct.
        key={`cols-${numColumns}`}
      />
    );
  },
);

ProductGridImpl.displayName = 'ProductGrid';

export const ProductGrid = React.memo(ProductGridImpl);
