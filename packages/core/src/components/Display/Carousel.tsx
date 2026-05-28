import * as React from 'react';
import {
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface CarouselProps<T = unknown> extends Omit<ViewProps, 'style' | 'children'> {
  /** Data-driven pages. Provide `renderItem` alongside this. */
  readonly items?: readonly T[];
  /** Renders one page for each item. Required when `items` is set. */
  readonly renderItem?: (item: T, index: number) => React.ReactNode;
  /** Child-driven pages — each direct child becomes one page. */
  readonly children?: React.ReactNode;
  /** Show the page-indicator dots. Defaults to true. */
  readonly showDots?: boolean;
  /** Called when the active page changes. */
  readonly onPageChange?: (index: number) => void;
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_DOTS: ViewStyle = { flexDirection: 'row', justifyContent: 'center' };
const PAGE_FILL: ViewStyle = { flex: 1 };

const CarouselImpl = React.forwardRef<View, CarouselProps>(function Carousel(props, ref) {
  const { items, renderItem, children, showDots = true, onPageChange, style, ...rest } = props;
  const tokens = useTokens();
  const [width, setWidth] = React.useState(0);
  const [active, setActive] = React.useState(0);

  const pages = React.useMemo<React.ReactNode[]>(() => {
    if (items && renderItem) return items.map((item, i) => renderItem(item, i));
    return React.Children.toArray(children);
  }, [items, renderItem, children]);

  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const onMomentumScrollEnd = React.useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (width <= 0) return;
      const next = Math.round(e.nativeEvent.contentOffset.x / width);
      setActive((prev) => {
        if (next !== prev) onPageChange?.(next);
        return next;
      });
    },
    [width, onPageChange],
  );

  const dotsStyle: ViewStyle = {
    ...ROW_DOTS,
    gap: tokens.space.xs,
    paddingVertical: tokens.space.sm,
  };

  return (
    <View ref={ref} accessibilityRole="none" style={style} {...rest}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onLayout={onLayout}
        onMomentumScrollEnd={onMomentumScrollEnd}
        accessibilityRole="none"
      >
        {pages.map((page, i) => (
          <View key={i} accessibilityRole="none" style={width > 0 ? { width } : PAGE_FILL}>
            {page}
          </View>
        ))}
      </ScrollView>
      {showDots && pages.length > 1 ? (
        <View
          accessibilityRole="adjustable"
          accessibilityValue={{ min: 1, max: pages.length, now: active + 1 }}
          style={dotsStyle}
        >
          {pages.map((_, i) => {
            const isActive = i === active;
            return (
              <View
                key={i}
                accessibilityRole="none"
                style={{
                  width: isActive ? tokens.space.sm : tokens.space.xs,
                  height: tokens.space.xs,
                  borderRadius: tokens.radii.pill,
                  backgroundColor: isActive
                    ? tokens.colors.action.primary
                    : tokens.colors.border.strong,
                }}
              />
            );
          })}
        </View>
      ) : null}
    </View>
  );
});

CarouselImpl.displayName = 'Carousel';

export const Carousel = tagComponent(CarouselImpl, 'Carousel') as (<T = unknown>(
  props: CarouselProps<T> & React.RefAttributes<View>,
) => React.ReactElement | null) & { displayName?: string };
