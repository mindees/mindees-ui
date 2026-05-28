import * as React from 'react';
import { Pressable, type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

import { Input, type InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'keyboardType' | 'trailing'> {
  /** Minimum allowed value. Stepper and clamping respect this. */
  readonly min?: number;
  /** Maximum allowed value. Stepper and clamping respect this. */
  readonly max?: number;
  /** Increment used by the stepper buttons. Defaults to 1. */
  readonly step?: number;
  /** Show -/+ stepper buttons on the trailing edge. */
  readonly showStepper?: boolean;
  /** Raw parsed numeric value. `NaN` when the field is empty or unparseable. */
  readonly onChangeValue?: (value: number) => void;
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  let next = value;
  if (typeof min === 'number' && next < min) next = min;
  if (typeof max === 'number' && next > max) next = max;
  return next;
}

const NumberInputImpl = React.forwardRef<TextInput, NumberInputProps>(
  function NumberInput(props, ref) {
    const {
      min,
      max,
      step = 1,
      showStepper = false,
      onChangeValue,
      value,
      onChangeText,
      ...rest
    } = props;
    const tokens = useTokens();

    const handleChangeText = React.useCallback(
      (text: string) => {
        onChangeText?.(text);
        if (onChangeValue) onChangeValue(text === '' ? NaN : Number(text));
      },
      [onChangeText, onChangeValue],
    );

    const nudge = React.useCallback(
      (direction: 1 | -1) => {
        const current = typeof value === 'string' && value !== '' ? Number(value) : 0;
        const base = Number.isNaN(current) ? 0 : current;
        const next = clamp(base + direction * step, min, max);
        onChangeText?.(String(next));
        onChangeValue?.(next);
      },
      [value, step, min, max, onChangeText, onChangeValue],
    );

    const stepper = showStepper ? (
      <>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrement"
          hitSlop={8}
          onPress={() => nudge(-1)}
          style={{ paddingHorizontal: tokens.space.xs }}
        >
          <Text tone="muted">−</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increment"
          hitSlop={8}
          onPress={() => nudge(1)}
          style={{ paddingHorizontal: tokens.space.xs }}
        >
          <Text tone="muted">+</Text>
        </Pressable>
      </>
    ) : undefined;

    return (
      <Input
        ref={ref}
        keyboardType="numeric"
        value={value}
        onChangeText={handleChangeText}
        trailing={stepper}
        {...rest}
      />
    );
  },
);

NumberInputImpl.displayName = 'NumberInput';

export const NumberInput = tagComponent(NumberInputImpl, 'NumberInput');
