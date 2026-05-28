import * as React from 'react';
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  PanResponder,
  type PanResponderGestureState,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface SliderProps extends Omit<ViewProps, 'children'> {
  /** Current value. Clamped into [min, max]. */
  readonly value?: number;
  /** Fired continuously as the thumb is dragged. */
  readonly onChange?: (value: number) => void;
  /** Fired once when the drag gesture ends. */
  readonly onChangeEnd?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  /** Step granularity. `0` (default) means continuous. */
  readonly step?: number;
  readonly disabled?: boolean;
  /** Accessible name for the slider. */
  readonly accessibilityLabel?: string;
  /** Style applied to the root container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;

const staticStyles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    minHeight: THUMB_SIZE + 8,
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: TRACK_HEIGHT / 2,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    borderWidth: 2,
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
});

export function clampValue(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function snapToStep(value: number, min: number, step: number): number {
  if (step <= 0) return value;
  return min + Math.round((value - min) / step) * step;
}

const SliderImpl = React.forwardRef<View, SliderProps>(function Slider(props, ref) {
  const {
    value = 0,
    onChange,
    onChangeEnd,
    min = 0,
    max = 1,
    step = 0,
    disabled = false,
    accessibilityLabel,
    style,
    ...rest
  } = props;
  const tokens = useTokens();

  const trackWidth = React.useRef(0);
  // Keep latest props in a ref so the PanResponder (created once) always reads
  // current values without being re-instantiated on every render.
  const latest = React.useRef({ value, min, max, step, disabled, onChange, onChangeEnd });
  latest.current = { value, min, max, step, disabled, onChange, onChangeEnd };

  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  const computeFromX = React.useCallback((x: number): number => {
    const { min: lo, max: hi, step: st } = latest.current;
    const width = trackWidth.current;
    if (width <= 0) return lo;
    const ratio = clampValue(x / width, 0, 1);
    const raw = lo + ratio * (hi - lo);
    return clampValue(snapToStep(raw, lo, st), lo, hi);
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.disabled,
        onMoveShouldSetPanResponder: () => !latest.current.disabled,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          if (latest.current.disabled) return;
          latest.current.onChange?.(computeFromX(e.nativeEvent.locationX));
        },
        onPanResponderMove: (e: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (latest.current.disabled) return;
          const next = computeFromX(e.nativeEvent.locationX + gesture.dx);
          latest.current.onChange?.(next);
        },
        onPanResponderRelease: (e: GestureResponderEvent) => {
          if (latest.current.disabled) return;
          latest.current.onChangeEnd?.(computeFromX(e.nativeEvent.locationX));
        },
      }),
    [computeFromX],
  );

  const clamped = clampValue(value, min, max);
  const ratio = max > min ? (clamped - min) / (max - min) : 0;
  const pct = `${ratio * 100}%` as const;

  const trackStyle: ViewStyle = { backgroundColor: tokens.colors.background.subtle };
  const fillStyle: ViewStyle = {
    width: pct,
    backgroundColor: disabled ? tokens.colors.action.primaryDisabled : tokens.colors.action.primary,
  };
  const thumbStyle: ViewStyle = {
    left: pct,
    marginLeft: -THUMB_SIZE / 2,
    backgroundColor: tokens.colors.background.surface,
    borderColor: disabled ? tokens.colors.action.primaryDisabled : tokens.colors.action.primary,
  };

  return (
    <View
      ref={ref}
      style={[staticStyles.root, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min, max, now: clamped }}
      {...rest}
    >
      <View
        style={[staticStyles.track, trackStyle]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={[staticStyles.fill, fillStyle]} pointerEvents="none" />
      </View>
      <View style={[staticStyles.thumb, thumbStyle]} pointerEvents="none" />
    </View>
  );
});

SliderImpl.displayName = 'Slider';

export const Slider = tagComponent(SliderImpl, 'Slider');
