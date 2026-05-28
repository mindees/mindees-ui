import { HStack, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import { Pressable, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface QuantityStepperProps {
  /** Current quantity (controlled). */
  readonly value: number;
  /** Called with the next clamped quantity. */
  readonly onChange: (next: number) => void;
  /** Minimum quantity. Defaults to 1. */
  readonly min?: number;
  /** Maximum quantity. Defaults to 99. */
  readonly max?: number;
  /** Step increment. Defaults to 1. */
  readonly step?: number;
  /** Disables both controls. */
  readonly disabled?: boolean;
  /** Accessible label prefix for the control. Defaults to "Quantity". */
  readonly label?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  control: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    minWidth: 32,
    textAlign: 'center',
  },
});

/**
 * A compact -/value/+ quantity control. Shared by `AddToCartButton` and
 * `CartItem`. Controlled: the parent owns `value` and clamps via `onChange`.
 */
const QuantityStepperImpl = React.forwardRef<View, QuantityStepperProps>(
  function QuantityStepper(props, ref) {
    const {
      value,
      onChange,
      min = 1,
      max = 99,
      step = 1,
      disabled = false,
      label = 'Quantity',
      style,
    } = props;
    const tokens = useTokens();

    const canDecrement = !disabled && value > min;
    const canIncrement = !disabled && value < max;

    const handleDecrement = React.useCallback(() => {
      if (value > min) onChange(Math.max(min, value - step));
    }, [value, min, step, onChange]);

    const handleIncrement = React.useCallback(() => {
      if (value < max) onChange(Math.min(max, value + step));
    }, [value, max, step, onChange]);

    const containerStyle: ViewStyle = {
      borderWidth: 1,
      borderColor: tokens.colors.border.default,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.background.surface,
    };

    return (
      <HStack
        ref={ref}
        gap="none"
        align="center"
        disableAutoSpacing
        accessibilityRole="adjustable"
        accessibilityLabel={label}
        accessibilityValue={{ min, max, now: value }}
        style={[containerStyle, style]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Decrease quantity"
          accessibilityState={{ disabled: !canDecrement }}
          disabled={!canDecrement}
          onPress={handleDecrement}
          hitSlop={6}
          style={staticStyles.control}
        >
          <Text variant="bodyLg" tone={canDecrement ? 'primary' : 'muted'}>
            −
          </Text>
        </Pressable>
        <Text variant="body" weight="semibold" tone="primary" style={staticStyles.value}>
          {value}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Increase quantity"
          accessibilityState={{ disabled: !canIncrement }}
          disabled={!canIncrement}
          onPress={handleIncrement}
          hitSlop={6}
          style={staticStyles.control}
        >
          <Text variant="bodyLg" tone={canIncrement ? 'primary' : 'muted'}>
            +
          </Text>
        </Pressable>
      </HStack>
    );
  },
);

QuantityStepperImpl.displayName = 'QuantityStepper';

export const QuantityStepper = React.memo(QuantityStepperImpl);
