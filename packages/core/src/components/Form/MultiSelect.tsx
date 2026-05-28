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
import { Chip } from '../Display/Tag';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

import type { SelectOption } from './Select';

export interface MultiSelectProps extends Omit<ViewProps, 'children'> {
  /** Options to choose from. */
  readonly options: readonly SelectOption[];
  /** Currently selected values. */
  readonly value?: readonly string[];
  /** Fired with the full next array of selected values. */
  readonly onChange?: (value: string[]) => void;
  /** Shown on the trigger when nothing is selected. */
  readonly placeholder?: string;
  /** Render selected items as chips on the trigger instead of a count summary. */
  readonly showChips?: boolean;
  /** Force a disabled state outside of a FormField. */
  readonly disabled?: boolean;
  /** Force an invalid state outside of a FormField. */
  readonly invalid?: boolean;
  /** Style applied to the trigger container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_MIN_HEIGHT = 44;
const ROW_MIN_HEIGHT = 44;
const EMPTY: readonly string[] = [];

const MultiSelectImpl = React.forwardRef<View, MultiSelectProps>(function MultiSelect(props, ref) {
  const {
    options,
    value = EMPTY,
    onChange,
    placeholder = 'Select…',
    showChips = false,
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

  const selectedSet = React.useMemo(() => new Set(value), [value]);
  const selectedOptions = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet],
  );

  const handleOpen = React.useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const handleClose = React.useCallback(() => setOpen(false), []);

  const handleToggle = React.useCallback(
    (toggled: string) => {
      const next = value.includes(toggled)
        ? value.filter((v) => v !== toggled)
        : [...value, toggled];
      onChange?.(next);
    },
    [value, onChange],
  );

  const removeChip = React.useCallback(
    (removed: string) => {
      onChange?.(value.filter((v) => v !== removed));
    },
    [value, onChange],
  );

  const triggerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: TRIGGER_MIN_HEIGHT,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space['2xs'],
    backgroundColor: tokens.colors.background.surface,
    borderColor: invalid ? tokens.colors.status.danger : tokens.colors.border.default,
    borderWidth: 1,
    borderRadius: tokens.radii.md,
    opacity: disabled ? 0.6 : 1,
  };

  const chipsWrapStyle: ViewStyle = {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: tokens.space['2xs'],
    marginRight: tokens.space['2xs'],
  };

  const summaryWrapStyle: ViewStyle = {
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

  const count = selectedOptions.length;
  const summary = count === 0 ? placeholder : `${count} selected`;

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
        {showChips && count > 0 ? (
          <View style={chipsWrapStyle}>
            {selectedOptions.map((option) => (
              <Chip key={option.value} size="sm" onRemove={() => removeChip(option.value)}>
                {option.label}
              </Chip>
            ))}
          </View>
        ) : (
          <View style={summaryWrapStyle}>
            <Text tone={count > 0 ? 'primary' : 'muted'} numberOfLines={1}>
              {summary}
            </Text>
          </View>
        )}
        <ChevronDownIcon size={18} color={tokens.colors.text.muted} />
      </Pressable>

      <Modal visible={open} onClose={handleClose} centered accessibilityLabel="Select options">
        <ScrollView keyboardShouldPersistTaps="handled">
          {options.map((option) => {
            const isSelected = selectedSet.has(option.value);
            return (
              <Pressable
                key={option.value}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                onPress={() => handleToggle(option.value)}
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

MultiSelectImpl.displayName = 'MultiSelect';

export const MultiSelect = tagComponent(MultiSelectImpl, 'MultiSelect');
