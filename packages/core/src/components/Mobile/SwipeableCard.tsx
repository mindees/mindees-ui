import * as React from 'react';
import {
  Animated,
  Dimensions,
  type GestureResponderEvent,
  PanResponder,
  type PanResponderGestureState,
  type View,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Card, type CardProps } from '../Display/Card';

export interface SwipeableCardProps extends CardProps {
  /** Fired once the card is swiped past the dismiss threshold. */
  readonly onDismiss?: () => void;
  /** Allowed dismiss direction(s). Defaults to `'horizontal'`. */
  readonly direction?: 'left' | 'right' | 'horizontal';
  /** Fraction of screen width the card must pass to dismiss. Defaults to 0.4. */
  readonly threshold?: number;
}

const AnimatedCard = Animated.createAnimatedComponent(Card);

const SwipeableCardImpl = React.forwardRef<View, SwipeableCardProps>(
  function SwipeableCard(props, ref) {
    const {
      onDismiss,
      direction = 'horizontal',
      threshold = 0.4,
      style,
      children,
      ...rest
    } = props;

    const translateX = React.useRef(new Animated.Value(0)).current;
    const opacity = React.useRef(new Animated.Value(1)).current;
    const width = Dimensions.get('window').width;

    // Keep mutable props in a ref so the PanResponder is created once.
    const latest = React.useRef({ onDismiss, direction, threshold, width });
    latest.current = { onDismiss, direction, threshold, width };

    const allow = React.useCallback((dx: number): boolean => {
      const dir = latest.current.direction;
      if (dir === 'horizontal') return true;
      if (dir === 'left') return dx < 0;
      return dx > 0;
    }, []);

    const reset = React.useCallback(() => {
      Animated.spring(translateX, { toValue: 0, useNativeDriver: true, bounciness: 0 }).start();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }, [translateX, opacity]);

    const dismiss = React.useCallback(
      (toValue: number) => {
        Animated.timing(translateX, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        }).start(() => latest.current.onDismiss?.());
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      },
      [translateX, opacity],
    );

    const panResponder = React.useMemo(
      () =>
        PanResponder.create({
          onMoveShouldSetPanResponder: (_e: GestureResponderEvent, g: PanResponderGestureState) =>
            Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 6 && allow(g.dx),
          onPanResponderMove: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
            if (!allow(g.dx)) return;
            translateX.setValue(g.dx);
            const w = latest.current.width || 1;
            const next = 1 - Math.min(Math.abs(g.dx) / w, 0.6);
            opacity.setValue(next);
          },
          onPanResponderRelease: (_e: GestureResponderEvent, g: PanResponderGestureState) => {
            const { width: w, threshold: th } = latest.current;
            if (Math.abs(g.dx) > w * th && allow(g.dx)) {
              dismiss(g.dx > 0 ? w : -w);
            } else {
              reset();
            }
          },
          onPanResponderTerminate: reset,
        }),
      [translateX, opacity, allow, dismiss, reset],
    );

    return (
      <AnimatedCard
        ref={ref}
        style={[{ transform: [{ translateX }], opacity }, style]}
        {...panResponder.panHandlers}
        {...rest}
      >
        {children}
      </AnimatedCard>
    );
  },
);

SwipeableCardImpl.displayName = 'SwipeableCard';

export const SwipeableCard = tagComponent(React.memo(SwipeableCardImpl), 'SwipeableCard');
