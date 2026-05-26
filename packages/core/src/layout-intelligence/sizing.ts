import type { DimensionValue, FlexStyle, ViewStyle } from 'react-native';

// Figma-style auto-layout sizing. Components participating in the Layout
// Intelligence Layer expose `width` / `height` props of this type. The
// heuristics resolve deterministically to flex style — no measurement passes,
// no asynchronous layout decisions.
//
//   - `fill`  -> takes all available space on that axis (flex: 1)
//   - `hug`   -> shrinks to fit content (no flex, intrinsic size)
//   - number  -> fixed dp size
//   - `${number}%` -> percentage size (uses RN's DimensionValue support)

export type IntrinsicSize = 'fill' | 'hug' | number | `${number}%`;

export interface SizeProps {
  readonly width?: IntrinsicSize;
  readonly height?: IntrinsicSize;
  readonly minWidth?: number | `${number}%`;
  readonly minHeight?: number | `${number}%`;
  readonly maxWidth?: number | `${number}%`;
  readonly maxHeight?: number | `${number}%`;
}

// Axis-aware resolver. The Stack/HStack/VStack components map their main
// axis to width or height; this lets `fill` mean "main-axis fill" inside a
// stack, without each child needing to know which axis its parent runs on.
//
// The rules are deterministic:
//   fill   -> flex: 1, axis dimension undefined (let flex own it)
//   hug    -> flexShrink: 0, axis dimension undefined (intrinsic content size)
//   number -> axis dimension = N
//   `N%`   -> axis dimension = 'N%'
//
// Test: `sizing.test.ts` covers every input/axis combination.
export function resolveSizeToStyle(size: IntrinsicSize | undefined, axis: 'width' | 'height'): FlexStyle {
  if (size === undefined) return {};
  if (size === 'fill') {
    return { flexGrow: 1, flexShrink: 1, flexBasis: 0 } satisfies FlexStyle;
  }
  if (size === 'hug') {
    return { flexShrink: 0 } satisfies FlexStyle;
  }
  return axis === 'width'
    ? ({ width: size as DimensionValue } satisfies FlexStyle)
    : ({ height: size as DimensionValue } satisfies FlexStyle);
}

export function resolveSizeProps(props: SizeProps): ViewStyle {
  const style: ViewStyle & FlexStyle = {
    ...resolveSizeToStyle(props.width, 'width'),
    ...resolveSizeToStyle(props.height, 'height'),
  };
  if (props.minWidth !== undefined) style.minWidth = props.minWidth as DimensionValue;
  if (props.minHeight !== undefined) style.minHeight = props.minHeight as DimensionValue;
  if (props.maxWidth !== undefined) style.maxWidth = props.maxWidth as DimensionValue;
  if (props.maxHeight !== undefined) style.maxHeight = props.maxHeight as DimensionValue;
  return style;
}
