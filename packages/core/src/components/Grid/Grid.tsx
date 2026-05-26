import { type SpaceToken, space } from '@mindees/tokens';
import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Box, type BoxProps } from '../Box/Box';

export interface GridProps extends Omit<BoxProps, 'asChild'> {
  /** Number of columns. Each child occupies one column unless wider via `gridSpan`. */
  readonly columns: number;
  /** Token-based gap between cells in both axes. Defaults to `md`. */
  readonly gap?: SpaceToken | number;
  readonly children?: React.ReactNode;
}

/**
 * A simple flexbox grid. Children are wrapped into row-cells of equal width
 * (1 / `columns`); use a wrapper view per child if you need a different span.
 * For complex CSS-Grid-style layouts on React Native Web, consume the
 * underlying View directly with `gridTemplateColumns`.
 */
const GridImpl = React.forwardRef<View, GridProps>(function Grid(props, ref) {
  const { columns, gap = 'md', children, style, ...rest } = props;
  const gapPx = typeof gap === 'number' ? gap : space[gap];

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: gapPx,
    columnGap: gapPx,
  };

  const cellWidth = `${100 / columns}%` as const;

  const cells = React.Children.toArray(children).map((child, idx) => (
    <View
      key={(React.isValidElement(child) && child.key) || idx}
      style={{
        // Subtract the gap allocation so cells lay out cleanly.
        width: `calc(${cellWidth} - ${(gapPx * (columns - 1)) / columns}px)` as never,
        // RN < 0.74 doesn't support `calc()`; fall back via maxWidth to keep
        // a reasonable layout even when calc is dropped.
        flexBasis: cellWidth,
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      {child}
    </View>
  ));

  return (
    <Box ref={ref} style={[containerStyle, style]} {...rest}>
      {cells}
    </Box>
  );
});

GridImpl.displayName = 'Grid';

export const Grid = tagComponent(GridImpl, 'Grid');
