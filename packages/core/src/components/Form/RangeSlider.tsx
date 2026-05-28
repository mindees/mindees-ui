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

import { clampValue, snapToStep } from './Slider';

export interface RangeSliderProps extends Omit<ViewProps, 'children'> {
  /** Current [low, high] pair. Always normalised so low <= high. */
  readonly value?: readonly [number, number];
  /** Fired continuously as a thumb is dragged. */
  readonly onChange?: (value: [number, number]) => void;
  /** Fired once when the drag gesture ends. */
  readonly onChangeEnd?: (value: [number, number]) => void;
  readonly min?: number;
  readonly max?: number;
  /** Step granularity. `0` (default) means continuous. */
  readonly step?: number;
  readonly disabled?: boolean;
  /** Accessible name for the range slider. */
  readonly accessibilityLabel?: string;
  /** Style applied to the root container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const THUMB_SIZE = 24;
const TRACK_HEIGHT = 4;
const DEFAULT_VALUE: readonly [number, number] = [0, 1];

const staticStyles = StyleSheet.create({
  root: {
    justifyContent: 'center',
    minHeight: THUMB_SIZE + 8,
    paddingHorizontal: THUMB_SIZE / 2,
  },
  track: {
    height: TRACK_HEIGHT,
    borderRadius: TRACK_HEIGHT / 2,
  },
  fill: {
    position: 'absolute',
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
    marginLeft: -THUMB_SIZE / 2,
    top: -(THUMB_SIZE - TRACK_HEIGHT) / 2,
  },
});

const RangeSliderImpl = React.forwardRef<View, RangeSliderProps>(function RangeSlider(props, ref) {
  const {
    value = DEFAULT_VALUE,
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
  // Which thumb the current gesture controls: 0 = low, 1 = high.
  const activeThumb = React.useRef<0 | 1>(0);
  const latest = React.useRef({ value, min, max, step, disabled, onChange, onChangeEnd });
  latest.current = { value, min, max, step, disabled, onChange, onChangeEnd };

  const onLayout = React.useCallback((e: LayoutChangeEvent) => {
    trackWidth.current = e.nativeEvent.layout.width;
  }, []);

  const valueAtX = React.useCallback((x: number): number => {
    const { min: lo, max: hi, step: st } = latest.current;
    const width = trackWidth.current;
    if (width <= 0) return lo;
    const ratio = clampValue(x / width, 0, 1);
    const raw = lo + ratio * (hi - lo);
    return clampValue(snapToStep(raw, lo, st), lo, hi);
  }, []);

  // Produce the next normalised pair given the active thumb's new value.
  const buildPair = React.useCallback((next: number): [number, number] => {
    const [low, high] = latest.current.value;
    if (activeThumb.current === 0) {
      return [Math.min(next, high), high];
    }
    return [low, Math.max(next, low)];
  }, []);

  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => !latest.current.disabled,
        onMoveShouldSetPanResponder: () => !latest.current.disabled,
        onPanResponderGrant: (e: GestureResponderEvent) => {
          if (latest.current.disabled) return;
          const touched = valueAtX(e.nativeEvent.locationX);
          const [low, high] = latest.current.value;
          // Pick the nearer thumb; ties favour the low thumb.
          activeThumb.current = Math.abs(touched - low) <= Math.abs(touched - high) ? 0 : 1;
          latest.current.onChange?.(buildPair(touched));
        },
        onPanResponderMove: (e: GestureResponderEvent, gesture: PanResponderGestureState) => {
          if (latest.current.disabled) return;
          const next = valueAtX(e.nativeEvent.locationX + gesture.dx);
          latest.current.onChange?.(buildPair(next));
        },
        onPanResponderRelease: (e: GestureResponderEvent) => {
          if (latest.current.disabled) return;
          const next = valueAtX(e.nativeEvent.locationX);
          latest.current.onChangeEnd?.(buildPair(next));
        },
      }),
    [valueAtX, buildPair],
  );

  const span = max > min ? max - min : 1;
  const lowClamped = clampValue(value[0], min, max);
  const highClamped = clampValue(value[1], min, max);
  const lowRatio = (lowClamped - min) / span;
  const highRatio = (highClamped - min) / span;
  const lowPct = `${lowRatio * 100}%` as const;
  const highPct = `${highRatio * 100}%` as const;
  const fillWidthPct = `${(highRatio - lowRatio) * 100}%` as const;

  const accent = disabled ? tokens.colors.action.primaryDisabled : tokens.colors.action.primary;

  const trackStyle: ViewStyle = { backgroundColor: tokens.colors.background.subtle };
  const fillStyle: ViewStyle = {
    left: lowPct,
    width: fillWidthPct,
    backgroundColor: accent,
  };
  const thumbStyle: ViewStyle = {
    backgroundColor: tokens.colors.background.surface,
    borderColor: accent,
  };

  return (
    <View
      ref={ref}
      style={[staticStyles.root, style]}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      accessibilityValue={{ min, max, now: lowClamped, text: `${lowClamped} to ${highClamped}` }}
      {...rest}
    >
      <View
        style={[staticStyles.track, trackStyle]}
        onLayout={onLayout}
        {...panResponder.panHandlers}
      >
        <View style={[staticStyles.fill, fillStyle]} pointerEvents="none" />
      </View>
      <View style={[staticStyles.thumb, thumbStyle, { left: lowPct }]} pointerEvents="none" />
      <View style={[staticStyles.thumb, thumbStyle, { left: highPct }]} pointerEvents="none" />
    </View>
  );
});

RangeSliderImpl.displayName = 'RangeSlider';

export const RangeSlider = tagComponent(RangeSliderImpl, 'RangeSlider');
