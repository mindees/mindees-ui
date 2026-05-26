import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { CheckIcon } from '@mindees/icons';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface CheckboxProps {
  readonly checked?: boolean;
  readonly defaultChecked?: boolean;
  readonly indeterminate?: boolean;
  readonly disabled?: boolean;
  readonly onChange?: (checked: boolean) => void;
  /** Label rendered to the right of the checkbox; tap area covers the label too. */
  readonly label?: React.ReactNode;
  readonly accessibilityLabel?: string;
}

const CheckboxImpl = React.forwardRef<View, CheckboxProps>(function Checkbox(props, ref) {
  const {
    checked,
    defaultChecked,
    indeterminate = false,
    disabled = false,
    onChange,
    label,
    accessibilityLabel,
  } = props;
  const isControlled = checked !== undefined;
  const [internal, setInternal] = React.useState(defaultChecked ?? false);
  const value = isControlled ? checked : internal;
  const tokens = useTokens();

  const handlePress = React.useCallback(() => {
    if (disabled) return;
    const next = !value;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  }, [disabled, isControlled, onChange, value]);

  const boxStyle: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: tokens.radii.xs,
    borderWidth: 2,
    borderColor:
      value || indeterminate ? tokens.colors.action.primary : tokens.colors.border.strong,
    backgroundColor: value || indeterminate ? tokens.colors.action.primary : 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space.xs,
  };

  return (
    <Pressable
      ref={ref}
      onPress={handlePress}
      accessibilityRole="checkbox"
      accessibilityState={{
        checked: indeterminate ? 'mixed' : value,
        disabled,
      }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={rowStyle}
      disabled={disabled}
    >
      <View style={boxStyle}>
        {indeterminate ? (
          <View
            style={{
              width: 10,
              height: 2,
              backgroundColor: tokens.colors.text.onAccent,
              borderRadius: 1,
            }}
          />
        ) : value ? (
          <CheckIcon size={14} color={tokens.colors.text.onAccent} />
        ) : null}
      </View>
      {label !== undefined ? (
        typeof label === 'string' ? (
          <Text tone={disabled ? 'muted' : 'primary'}>{label}</Text>
        ) : (
          label
        )
      ) : null}
    </Pressable>
  );
});

CheckboxImpl.displayName = 'Checkbox';

export const Checkbox = tagComponent(CheckboxImpl, 'Checkbox');
