import { ChevronDownIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Calendar } from '../Display/Calendar';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

export interface DatePickerProps extends Omit<ViewProps, 'children'> {
  /** Currently-selected date (controlled). */
  readonly value?: Date;
  /** Fires when a day is picked from the calendar. */
  readonly onChange?: (date: Date) => void;
  /** Shown on the trigger when no date is selected. */
  readonly placeholder?: string;
  /** Format the selected date. Defaults to the user's locale date string. */
  readonly format?: (date: Date) => string;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Style applied to the trigger container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_MIN_HEIGHT = 44;

// Pure-JS, dependency-free date formatting. `toLocaleDateString` is part of
// the JS runtime (ECMA-402) — guarded so a malformed Date never throws.
function defaultFormat(date: Date): string {
  if (Number.isNaN(date.getTime())) return '';
  try {
    return date.toLocaleDateString();
  } catch {
    return date.toDateString();
  }
}

const DatePickerImpl = React.forwardRef<View, DatePickerProps>(function DatePicker(props, ref) {
  const {
    value,
    onChange,
    placeholder = 'Select date…',
    format = defaultFormat,
    disabled: disabledProp,
    invalid: invalidProp,
    style,
    ...rest
  } = props;
  const tokens = useTokens();
  const ctx = useFormFieldA11y();
  const invalid = invalidProp ?? ctx?.invalid ?? false;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const [open, setOpen] = React.useState(false);

  const handleOpen = React.useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleSelect = React.useCallback(
    (next: Date) => {
      onChange?.(next);
      setOpen(false);
    },
    [onChange],
  );

  const label = value ? format(value) : '';

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TRIGGER_MIN_HEIGHT,
    paddingHorizontal: tokens.space.sm,
    backgroundColor: tokens.colors.background.surface,
    borderColor: invalid ? tokens.colors.status.danger : tokens.colors.border.default,
    borderWidth: 1,
    borderRadius: tokens.radii.md,
    opacity: disabled ? 0.6 : 1,
  };

  const labelWrapStyle: ViewStyle = {
    flex: 1,
    marginRight: tokens.space['2xs'],
  };

  return (
    <View ref={ref} style={style} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: open }}
        accessibilityLabel={ctx ? undefined : rest.accessibilityLabel}
        accessibilityLabelledBy={ctx?.accessibilityLabelledBy}
        nativeID={ctx?.id}
        aria-invalid={invalid}
        aria-required={ctx?.required}
        disabled={disabled}
        onPress={handleOpen}
        style={triggerStyle}
      >
        <View style={labelWrapStyle}>
          <Text tone={label ? 'primary' : 'muted'} numberOfLines={1}>
            {label || placeholder}
          </Text>
        </View>
        <ChevronDownIcon size={18} color={tokens.colors.text.muted} />
      </Pressable>

      <Modal visible={open} onClose={handleClose} centered accessibilityLabel="Pick a date">
        <Calendar value={value} onChange={handleSelect} />
      </Modal>
    </View>
  );
});

DatePickerImpl.displayName = 'DatePicker';

const DatePickerMemo = React.memo(DatePickerImpl);
DatePickerMemo.displayName = 'DatePicker';

export const DatePicker = tagComponent(DatePickerMemo, 'DatePicker');
