import * as React from 'react';
import { type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Box, type BoxProps } from '../Box/Box';

type Align = 'start' | 'center' | 'end' | 'stretch';
type Justify = 'start' | 'center' | 'end' | 'stretch';

const ALIGN_MAP: Record<Align, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

const JUSTIFY_MAP: Record<Justify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'space-between',
};

export interface ZStackProps extends Omit<BoxProps, 'asChild'> {
  /** Cross-axis (vertical) alignment of overlaid children. Defaults to `center`. */
  readonly align?: Align;
  /** Main-axis alignment when more than one child is rendered. Defaults to `center`. */
  readonly justify?: Justify;
  readonly children?: React.ReactNode;
}

// Inline absolute-fill so we don't depend on RN's StyleSheet ambient typing
// (which Unistyles' module augmentation can shadow).
const overlayStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

/**
 * Z-axis stack: overlays its children at the same point. First child is the
 * sizing reference; subsequent children are absolutely positioned over it.
 * Useful for badges over avatars, gradients over images, etc.
 */
const ZStackImpl = React.forwardRef<View, ZStackProps>(function ZStack(props, ref) {
  const { children, align = 'center', justify = 'center', style, ...rest } = props;
  const items = React.Children.toArray(children);

  const containerStyle: ViewStyle = {
    position: 'relative',
    alignItems: ALIGN_MAP[align],
    justifyContent: JUSTIFY_MAP[justify],
  };

  return (
    <Box ref={ref} style={[containerStyle, style]} {...rest}>
      {items.map((child, idx) => {
        if (idx === 0) return child;
        if (!React.isValidElement(child)) return child;
        const childProps = child.props as { style?: unknown };
        return React.cloneElement(child as React.ReactElement<{ style?: unknown }>, {
          style: [overlayStyle, childProps.style] as unknown,
        });
      })}
    </Box>
  );
});

ZStackImpl.displayName = 'ZStack';

export const ZStack = tagComponent(ZStackImpl, 'ZStack');
