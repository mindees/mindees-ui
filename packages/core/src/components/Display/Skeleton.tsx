import { type RadiusToken, radii } from '@mindees/tokens';
import * as React from 'react';
import { Animated, Easing, type View, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';

export interface SkeletonProps extends Omit<ViewProps, 'style'> {
  readonly width?: number | string;
  readonly height?: number | string;
  readonly radius?: RadiusToken | 'pill' | number;
  readonly style?: ViewStyle;
}

const SkeletonImpl = React.forwardRef<View, SkeletonProps>(function Skeleton(props, ref) {
  const { width = '100%', height = 16, radius = 'sm', style, ...rest } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const pulse = React.useRef(new Animated.Value(0.5)).current;

  React.useEffect(() => {
    if (reduceMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.bezier(...tokens.easing.standard),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.bezier(...tokens.easing.standard),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion, tokens.easing.standard]);

  const resolvedRadius = typeof radius === 'number' ? radius : radii[radius];

  const block: ViewStyle = {
    width: width as ViewStyle['width'],
    height: height as ViewStyle['height'],
    backgroundColor: tokens.colors.background.subtle,
    borderRadius: resolvedRadius,
  };

  return (
    <Animated.View
      ref={ref}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[block, { opacity: pulse }, style]}
      {...rest}
    />
  );
});

SkeletonImpl.displayName = 'Skeleton';

export const Skeleton = tagComponent(SkeletonImpl, 'Skeleton');
