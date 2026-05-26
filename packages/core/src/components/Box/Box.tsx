import {
  type SpaceToken,
  type RadiusToken,
  type ShadowToken,
  space,
  radii,
  resolveShadow,
} from '@mindees/tokens';
import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { resolveSizeProps, type SizeProps } from '../../layout-intelligence/sizing';
import { Slot, type AsChildProps } from '../../layout-intelligence/Slot';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTheme } from '../../theme/ThemeProvider';

type SpaceValue = SpaceToken | number;

export interface BoxOwnProps extends SizeProps {
  // padding shorthands (token name OR raw dp number)
  readonly padding?: SpaceValue;
  readonly paddingX?: SpaceValue;
  readonly paddingY?: SpaceValue;
  readonly paddingTop?: SpaceValue;
  readonly paddingRight?: SpaceValue;
  readonly paddingBottom?: SpaceValue;
  readonly paddingLeft?: SpaceValue;
  // margin shorthands
  readonly margin?: SpaceValue;
  readonly marginX?: SpaceValue;
  readonly marginY?: SpaceValue;
  readonly marginTop?: SpaceValue;
  readonly marginRight?: SpaceValue;
  readonly marginBottom?: SpaceValue;
  readonly marginLeft?: SpaceValue;
  // surface tokens
  /** Semantic theme background key (e.g. `'canvas' | 'surface' | 'subtle'`). */
  readonly background?: keyof ReturnType<typeof useTheme>['tokens']['colors']['background'];
  /** Semantic border colour key. Triggers a 1-dp border. */
  readonly borderColor?: keyof ReturnType<typeof useTheme>['tokens']['colors']['border'];
  readonly borderWidth?: number;
  readonly radius?: RadiusToken;
  readonly shadow?: ShadowToken;
}

export type BoxProps = AsChildProps<BoxOwnProps & ViewProps>;

function resolveSpace(value: SpaceValue | undefined): number | undefined {
  if (value === undefined) return undefined;
  return typeof value === 'number' ? value : space[value];
}

function buildBoxStyle(props: BoxOwnProps, theme: ReturnType<typeof useTheme>): ViewStyle {
  const padX = resolveSpace(props.paddingX);
  const padY = resolveSpace(props.paddingY);
  const marX = resolveSpace(props.marginX);
  const marY = resolveSpace(props.marginY);

  const style: ViewStyle = {
    paddingTop: resolveSpace(props.paddingTop) ?? padY ?? resolveSpace(props.padding),
    paddingRight: resolveSpace(props.paddingRight) ?? padX ?? resolveSpace(props.padding),
    paddingBottom: resolveSpace(props.paddingBottom) ?? padY ?? resolveSpace(props.padding),
    paddingLeft: resolveSpace(props.paddingLeft) ?? padX ?? resolveSpace(props.padding),
    marginTop: resolveSpace(props.marginTop) ?? marY ?? resolveSpace(props.margin),
    marginRight: resolveSpace(props.marginRight) ?? marX ?? resolveSpace(props.margin),
    marginBottom: resolveSpace(props.marginBottom) ?? marY ?? resolveSpace(props.margin),
    marginLeft: resolveSpace(props.marginLeft) ?? marX ?? resolveSpace(props.margin),
    ...resolveSizeProps(props),
  };

  if (props.background) {
    style.backgroundColor = theme.tokens.colors.background[props.background];
  }
  if (props.borderColor) {
    style.borderColor = theme.tokens.colors.border[props.borderColor];
    style.borderWidth = props.borderWidth ?? 1;
  }
  if (props.radius) {
    style.borderRadius = radii[props.radius];
  }
  if (props.shadow) {
    Object.assign(style, resolveShadow(props.shadow));
  }

  return style;
}

function BoxImpl(props: BoxProps, forwardedRef: React.Ref<View>): React.ReactElement {
  const theme = useTheme();
  // Pull every Box-specific prop out so we can pass the rest to the underlying View.
  const {
    asChild,
    style,
    children,
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    background,
    borderColor,
    borderWidth,
    radius,
    shadow,
    ...rest
  } = props;

  const boxStyle = React.useMemo(
    () =>
      buildBoxStyle(
        {
          width,
          height,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
          padding,
          paddingX,
          paddingY,
          paddingTop,
          paddingRight,
          paddingBottom,
          paddingLeft,
          margin,
          marginX,
          marginY,
          marginTop,
          marginRight,
          marginBottom,
          marginLeft,
          background,
          borderColor,
          borderWidth,
          radius,
          shadow,
        },
        theme,
      ),

    [
      theme,
      width,
      height,
      minWidth,
      minHeight,
      maxWidth,
      maxHeight,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      margin,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      background,
      borderColor,
      borderWidth,
      radius,
      shadow,
    ],
  );

  const composedStyle: StyleProp<ViewStyle> = [boxStyle, style];

  if (asChild) {
    return (
      <Slot ref={forwardedRef} style={composedStyle} {...rest}>
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <View ref={forwardedRef} style={composedStyle} {...rest}>
      {children}
    </View>
  );
}

const Box = tagComponent(
  React.forwardRef<View, BoxProps>(BoxImpl) as React.ForwardRefExoticComponent<
    BoxProps & React.RefAttributes<View>
  >,
  'Box',
);

Box.displayName = 'Box';

export { Box };
