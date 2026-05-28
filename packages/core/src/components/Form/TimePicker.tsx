import { ChevronDownIcon, ChevronUpIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, type StyleProp, View, type ViewProps, type ViewStyle } from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Button } from '../Button/Button';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

export interface TimeValue {
  readonly hour: number;
  readonly minute: number;
}

export interface TimePickerProps extends Omit<ViewProps, 'children'> {
  /** Currently-selected time (controlled). `hour` is 0–23. */
  readonly value?: TimeValue;
  /** Fires whenever the hour or minute changes. */
  readonly onChange?: (value: TimeValue) => void;
  /** Shown on the trigger when no time is selected. */
  readonly placeholder?: string;
  /** Render the dial and label in 24-hour time. Defaults to 12-hour. */
  readonly use24Hour?: boolean;
  /** Step size for the minute stepper. Defaults to 1. */
  readonly minuteStep?: number;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Style applied to the trigger container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_MIN_HEIGHT = 44;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

// Pure-JS modulo that always returns a non-negative result, so stepping the
// hour below 0 wraps to 23 instead of yielding a negative index.
function wrap(value: number, modulus: number): number {
  return ((value % modulus) + modulus) % modulus;
}

function clampStep(step: number): number {
  if (!Number.isFinite(step) || step < 1) return 1;
  return Math.floor(step);
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

// Normalise an arbitrary value into a valid {hour 0–23, minute 0–59} pair so a
// caller passing NaN / out-of-range numbers never breaks the dial.
function normalize(value: TimeValue | undefined): TimeValue {
  const hour =
    value && Number.isFinite(value.hour) ? wrap(Math.floor(value.hour), HOURS_IN_DAY) : 0;
  const minute =
    value && Number.isFinite(value.minute) ? wrap(Math.floor(value.minute), MINUTES_IN_HOUR) : 0;
  return { hour, minute };
}

function formatTime(value: TimeValue, use24Hour: boolean): string {
  if (use24Hour) return `${pad2(value.hour)}:${pad2(value.minute)}`;
  const period = value.hour < 12 ? 'AM' : 'PM';
  const h12 = value.hour % 12 === 0 ? 12 : value.hour % 12;
  return `${h12}:${pad2(value.minute)} ${period}`;
}

interface StepperColumnProps {
  readonly label: string;
  readonly display: string;
  readonly onIncrement: () => void;
  readonly onDecrement: () => void;
}

const StepperColumn = React.memo(function StepperColumn(props: StepperColumnProps) {
  const { label, display, onIncrement, onDecrement } = props;
  const tokens = useTokens();
  const columnStyle: ViewStyle = { alignItems: 'center', gap: tokens.space.xs };
  const valueStyle: ViewStyle = { minWidth: 56, alignItems: 'center' };
  return (
    <View style={columnStyle}>
      <Text variant="caption" tone="muted" weight="medium">
        {label}
      </Text>
      <Button
        variant="ghost"
        accessibilityLabel={`Increase ${label.toLowerCase()}`}
        onPress={onIncrement}
        leading={<ChevronUpIcon size={20} color={tokens.colors.text.primary} />}
      />
      <View style={valueStyle}>
        <Text variant="h4" weight="semibold">
          {display}
        </Text>
      </View>
      <Button
        variant="ghost"
        accessibilityLabel={`Decrease ${label.toLowerCase()}`}
        onPress={onDecrement}
        leading={<ChevronDownIcon size={20} color={tokens.colors.text.primary} />}
      />
    </View>
  );
});

const TimePickerImpl = React.forwardRef<View, TimePickerProps>(function TimePicker(props, ref) {
  const {
    value,
    onChange,
    placeholder = 'Select time…',
    use24Hour = false,
    minuteStep = 1,
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

  const current = React.useMemo(() => normalize(value), [value]);
  const step = clampStep(minuteStep);

  const handleOpen = React.useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const incHour = React.useCallback(() => {
    onChange?.({ hour: wrap(current.hour + 1, HOURS_IN_DAY), minute: current.minute });
  }, [onChange, current.hour, current.minute]);

  const decHour = React.useCallback(() => {
    onChange?.({ hour: wrap(current.hour - 1, HOURS_IN_DAY), minute: current.minute });
  }, [onChange, current.hour, current.minute]);

  const incMinute = React.useCallback(() => {
    onChange?.({ hour: current.hour, minute: wrap(current.minute + step, MINUTES_IN_HOUR) });
  }, [onChange, current.hour, current.minute, step]);

  const decMinute = React.useCallback(() => {
    onChange?.({ hour: current.hour, minute: wrap(current.minute - step, MINUTES_IN_HOUR) });
  }, [onChange, current.hour, current.minute, step]);

  const togglePeriod = React.useCallback(() => {
    onChange?.({ hour: wrap(current.hour + 12, HOURS_IN_DAY), minute: current.minute });
  }, [onChange, current.hour, current.minute]);

  const hourDisplay = use24Hour
    ? pad2(current.hour)
    : pad2(current.hour % 12 === 0 ? 12 : current.hour % 12);
  const label = value ? formatTime(current, use24Hour) : '';

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

  const dialStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.space.lg,
  };

  const separatorStyle: ViewStyle = { paddingTop: tokens.space.lg };

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

      <Modal visible={open} onClose={handleClose} centered accessibilityLabel="Pick a time">
        <View style={dialStyle}>
          <StepperColumn
            label="Hour"
            display={hourDisplay}
            onIncrement={incHour}
            onDecrement={decHour}
          />
          <View style={separatorStyle}>
            <Text variant="h4" weight="semibold" tone="muted">
              :
            </Text>
          </View>
          <StepperColumn
            label="Minute"
            display={pad2(current.minute)}
            onIncrement={incMinute}
            onDecrement={decMinute}
          />
          {use24Hour ? null : (
            <StepperColumn
              label="Period"
              display={current.hour < 12 ? 'AM' : 'PM'}
              onIncrement={togglePeriod}
              onDecrement={togglePeriod}
            />
          )}
        </View>
      </Modal>
    </View>
  );
});

TimePickerImpl.displayName = 'TimePicker';

const TimePickerMemo = React.memo(TimePickerImpl);
TimePickerMemo.displayName = 'TimePicker';

export const TimePicker = tagComponent(TimePickerMemo, 'TimePicker');
