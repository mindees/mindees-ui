import { type SpaceToken, space } from '@mindees/tokens';
import * as React from 'react';
import { type View, type ViewStyle } from 'react-native';

import { describeChildren } from '../../layout-intelligence/child-introspection';
import { StackContext, type StackContextValue } from '../../layout-intelligence/context';
import { resolveGapRule, resolveGapToken } from '../../layout-intelligence/spacing-rules';
import { tagComponent, type ComponentTag } from '../../layout-intelligence/tagged-component';
import { Box, type BoxProps } from '../Box/Box';

type Justify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';
// `baseline` is unreliable across RN platforms — omitted from the public API.
type Align = 'start' | 'center' | 'end' | 'stretch';

const JUSTIFY_MAP: Record<Justify, ViewStyle['justifyContent']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  'space-between': 'space-between',
  'space-around': 'space-around',
  'space-evenly': 'space-evenly',
};

const ALIGN_MAP: Record<Align, ViewStyle['alignItems']> = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
};

export interface StackOwnProps {
  /** Default token-based gap between children. Auto-spacing rules apply per pair. */
  readonly gap?: SpaceToken | number;
  /** When true, the LIL's deterministic per-pair gap multipliers are skipped. */
  readonly disableAutoSpacing?: boolean;
  readonly align?: Align;
  readonly justify?: Justify;
  readonly wrap?: boolean;
}

export interface StackProps extends StackOwnProps, Omit<BoxProps, 'asChild'> {
  readonly orientation?: 'row' | 'column';
  readonly children?: React.ReactNode;
}

function StackImpl(
  props: StackProps & { orientation: 'row' | 'column' },
  forwardedRef: React.Ref<View>,
): React.ReactElement {
  const {
    children,
    gap = 'md',
    disableAutoSpacing = false,
    align = 'stretch',
    justify = 'start',
    orientation,
    wrap = false,
    style,
    ...rest
  } = props;

  // Insert auto-spacing per consecutive pair. Each rule resolves to a token
  // multiplier; `disableAutoSpacing` falls back to a uniform `gap`.
  const slots = describeChildren(children);
  const baseGap = typeof gap === 'number' ? gap : space[gap];

  const items = slots.map((slot, i) => {
    if (i === 0) return slot.element;
    const prevTag = slots[i - 1]?.tag as ComponentTag | undefined;
    const rule = disableAutoSpacing ? 'base' : resolveGapRule(prevTag, slot.tag);
    const computed = disableAutoSpacing ? baseGap : resolveGapToken(gap, rule);
    const spacerStyle: ViewStyle =
      orientation === 'row' ? { width: computed } : { height: computed };
    return (
      <React.Fragment key={slot.element.key ?? i}>
        {/* Inline spacer keeps the LIL's per-pair adjustment without a child wrapper.
            A View instead of margin lets `gap`/`flex-wrap` interact naturally. */}
        <Box style={spacerStyle} pointerEvents="none" />
        {slot.element}
      </React.Fragment>
    );
  });

  const ctx: StackContextValue = { orientation, align, justify };

  const stackStyle: ViewStyle = {
    flexDirection: orientation,
    justifyContent: JUSTIFY_MAP[justify],
    alignItems: ALIGN_MAP[align],
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return (
    <StackContext.Provider value={ctx}>
      <Box ref={forwardedRef} style={[stackStyle, style]} {...rest}>
        {items}
      </Box>
    </StackContext.Provider>
  );
}

function makeStack(
  defaultOrientation: 'row' | 'column',
  tag: ComponentTag,
  displayName: string,
): React.ForwardRefExoticComponent<StackProps & React.RefAttributes<View>> {
  const C = React.forwardRef<View, StackProps>(function Stack(props, ref) {
    return StackImpl({ ...props, orientation: props.orientation ?? defaultOrientation }, ref);
  }) as React.ForwardRefExoticComponent<StackProps & React.RefAttributes<View>>;
  C.displayName = displayName;
  return tagComponent(C, tag);
}

/** Default vertical stack with token-aware auto-spacing. Override with `orientation`. */
export const Stack = makeStack('column', 'Stack', 'Stack');
/** Horizontal stack (row). Children flow left-to-right (or RTL on RTL locales). */
export const HStack = makeStack('row', 'HStack', 'HStack');
/** Vertical stack. Identical to `Stack`; the explicit name communicates intent. */
export const VStack = makeStack('column', 'VStack', 'VStack');
