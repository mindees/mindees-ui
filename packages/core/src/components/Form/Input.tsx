import * as React from 'react';
import { TextInput, type TextInputProps, View, type ViewStyle } from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface InputProps extends Omit<TextInputProps, 'editable'> {
  /** Slot rendered inside the input on the leading edge (icon, prefix). */
  readonly leading?: React.ReactNode;
  /** Slot rendered inside the input on the trailing edge (icon, clear button). */
  readonly trailing?: React.ReactNode;
  /** Visual size of the input. */
  readonly size?: 'sm' | 'md' | 'lg';
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
}

const HEIGHTS: Record<NonNullable<InputProps['size']>, number> = {
  sm: 36,
  md: 44,
  lg: 52,
};

const InputImpl = React.forwardRef<TextInput, InputProps>(function Input(props, ref) {
  const {
    leading,
    trailing,
    size = 'md',
    invalid: invalidProp,
    disabled: disabledProp,
    style,
    placeholderTextColor,
    ...rest
  } = props;
  const tokens = useTokens();
  const ctx = useFormFieldA11y();
  const invalid = invalidProp ?? ctx?.invalid ?? false;
  const disabled = disabledProp ?? ctx?.disabled ?? false;

  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HEIGHTS[size],
    paddingHorizontal: tokens.space.sm,
    backgroundColor: tokens.colors.background.surface,
    borderColor: invalid ? tokens.colors.status.danger : tokens.colors.border.default,
    borderWidth: 1,
    borderRadius: tokens.radii.md,
    opacity: disabled ? 0.6 : 1,
  };

  const inputStyle = {
    flex: 1,
    color: tokens.colors.text.primary,
    fontSize: tokens.textStyles.body.size,
    paddingVertical: 0,
    marginHorizontal: leading || trailing ? tokens.space['2xs'] : 0,
  };

  return (
    <View style={containerStyle} accessible={false}>
      {leading}
      <TextInput
        ref={ref}
        style={[inputStyle, style]}
        editable={!disabled}
        placeholderTextColor={placeholderTextColor ?? tokens.colors.text.muted}
        nativeID={ctx?.id}
        accessibilityLabel={ctx ? undefined : rest.accessibilityLabel}
        accessibilityLabelledBy={ctx?.accessibilityLabelledBy}
        accessibilityHint={rest.accessibilityHint}
        aria-invalid={invalid}
        aria-required={ctx?.required}
        {...rest}
      />
      {trailing}
    </View>
  );
});

InputImpl.displayName = 'Input';

export const Input = tagComponent(InputImpl, 'Input');
