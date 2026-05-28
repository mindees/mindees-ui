import { CheckIcon, ChevronDownIcon } from '@mindees/icons';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  type StyleProp,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

export interface SelectOption {
  readonly label: string;
  readonly value: string;
}

export interface SelectProps extends Omit<ViewProps, 'children'> {
  /** Options to choose from. */
  readonly options: readonly SelectOption[];
  /** Currently selected value. */
  readonly value?: string;
  /** Fired with the newly-selected value. */
  readonly onChange?: (value: string) => void;
  /** Shown on the trigger when nothing is selected. */
  readonly placeholder?: string;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Style applied to the trigger container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_MIN_HEIGHT = 44;
const ROW_MIN_HEIGHT = 44;

const SelectImpl = React.forwardRef<View, SelectProps>(function Select(props, ref) {
  const {
    options,
    value,
    onChange,
    placeholder = 'Select…',
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

  const selected = React.useMemo(() => options.find((o) => o.value === value), [options, value]);

  const handleOpen = React.useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleSelect = React.useCallback(
    (next: string) => {
      onChange?.(next);
      setOpen(false);
    },
    [onChange],
  );

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

  const rowBaseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: ROW_MIN_HEIGHT,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.xs,
    borderRadius: tokens.radii.sm,
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
          <Text tone={selected ? 'primary' : 'muted'} numberOfLines={1}>
            {selected ? selected.label : placeholder}
          </Text>
        </View>
        <ChevronDownIcon size={18} color={tokens.colors.text.muted} />
      </Pressable>

      <Modal visible={open} onClose={handleClose} centered accessibilityLabel="Select an option">
        <ScrollView keyboardShouldPersistTaps="handled">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="menuitem"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleSelect(option.value)}
                style={({ pressed }) => [
                  rowBaseStyle,
                  pressed ? { backgroundColor: tokens.colors.background.subtle } : null,
                ]}
              >
                <Text tone={isSelected ? 'link' : 'primary'} numberOfLines={1}>
                  {option.label}
                </Text>
                {isSelected ? <CheckIcon size={18} color={tokens.colors.text.link} /> : null}
              </Pressable>
            );
          })}
        </ScrollView>
      </Modal>
    </View>
  );
});

SelectImpl.displayName = 'Select';

export const Select = tagComponent(SelectImpl, 'Select');
