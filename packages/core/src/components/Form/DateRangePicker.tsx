import { ChevronDownIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Calendar } from '../Display/Calendar';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

export interface DateRange {
  readonly start?: Date;
  readonly end?: Date;
}

export interface DateRangePickerProps extends Omit<ViewProps, 'children'> {
  /** Currently-selected range (controlled). */
  readonly value?: DateRange;
  /** Fires whenever the range changes (start-only, or start+end). */
  readonly onChange?: (range: DateRange) => void;
  /** Shown on the trigger when no range is selected. */
  readonly placeholder?: string;
  /** Format a single endpoint. Defaults to the user's locale date string. */
  readonly format?: (date: Date) => string;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Style applied to the trigger container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_MIN_HEIGHT = 44;

// Pure-JS, dependency-free formatting — guarded so a bad Date never throws.
function defaultFormat(date: Date): string {
  if (Number.isNaN(date.getTime())) return '';
  try {
    return date.toLocaleDateString();
  } catch {
    return date.toDateString();
  }
}

const DateRangePickerImpl = React.forwardRef<View, DateRangePickerProps>(
  function DateRangePicker(props, ref) {
    const {
      value,
      onChange,
      placeholder = 'Select range…',
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

    const start = value?.start;
    const end = value?.end;

    const handleOpen = React.useCallback(() => {
      if (!disabled) setOpen(true);
    }, [disabled]);

    const handleClose = React.useCallback(() => setOpen(false), []);

    const handleSelect = React.useCallback(
      (next: Date) => {
        // First tap (or restarting after a complete range) sets the start.
        // Second tap completes the range, swapping if it lands before start.
        if (!start || end) {
          onChange?.({ start: next, end: undefined });
          return;
        }
        if (next.getTime() < start.getTime()) {
          onChange?.({ start: next, end: start });
        } else {
          onChange?.({ start, end: next });
        }
        setOpen(false);
      },
      [onChange, start, end],
    );

    // Highlight the active endpoint in the single-value Calendar: the end once
    // chosen, otherwise the start.
    const calendarValue = end ?? start;

    const label =
      start && end ? `${format(start)} – ${format(end)}` : start ? `${format(start)} – …` : '';

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

        <Modal visible={open} onClose={handleClose} centered accessibilityLabel="Pick a date range">
          <Calendar value={calendarValue} onChange={handleSelect} />
        </Modal>
      </View>
    );
  },
);

DateRangePickerImpl.displayName = 'DateRangePicker';

const DateRangePickerMemo = React.memo(DateRangePickerImpl);
DateRangePickerMemo.displayName = 'DateRangePicker';

export const DateRangePicker = tagComponent(DateRangePickerMemo, 'DateRangePicker');
