import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

interface RadioGroupContextValue {
  readonly value: string | undefined;
  readonly onValueChange: (next: string) => void;
  readonly name: string;
  readonly disabled: boolean;
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined);

export interface RadioProps {
  readonly value: string;
  readonly disabled?: boolean;
  readonly label?: React.ReactNode;
  readonly accessibilityLabel?: string;
}

const RadioImpl = React.forwardRef<View, RadioProps>(function Radio(props, ref) {
  const { value, disabled: disabledProp, label, accessibilityLabel } = props;
  const ctx = React.useContext(RadioGroupContext);
  if (!ctx && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('<Radio> rendered without a parent <RadioGroup>; selection state is unwired.');
  }
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const selected = ctx?.value === value;
  const tokens = useTokens();

  const ringStyle: ViewStyle = {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: selected ? tokens.colors.action.primary : tokens.colors.border.strong,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={accessibilityLabel}
      onPress={() => !disabled && ctx?.onValueChange(value)}
      disabled={disabled}
      hitSlop={8}
      style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.space.xs }}
    >
      <View style={ringStyle}>
        {selected ? (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: tokens.colors.action.primary,
            }}
          />
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

RadioImpl.displayName = 'Radio';

export const Radio = tagComponent(RadioImpl, 'Radio');

// ---------- RadioGroup ----------------------------------------------------
export interface RadioGroupProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (next: string) => void;
  readonly name: string;
  readonly disabled?: boolean;
  readonly children?: React.ReactNode;
}

const RadioGroupImpl = React.forwardRef<View, RadioGroupProps>(function RadioGroup(props, ref) {
  const { value, defaultValue, onValueChange, name, disabled = false, children } = props;
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<string | undefined>(defaultValue);
  const resolved = isControlled ? value : internal;

  const handleChange = React.useCallback(
    (next: string) => {
      if (!isControlled) setInternal(next);
      onValueChange?.(next);
    },
    [isControlled, onValueChange],
  );

  const ctx: RadioGroupContextValue = React.useMemo(
    () => ({ value: resolved, onValueChange: handleChange, name, disabled }),
    [resolved, handleChange, name, disabled],
  );

  return (
    <RadioGroupContext.Provider value={ctx}>
      <View ref={ref} accessibilityRole="radiogroup">
        {children}
      </View>
    </RadioGroupContext.Provider>
  );
});

RadioGroupImpl.displayName = 'RadioGroup';

export const RadioGroup = tagComponent(RadioGroupImpl, 'RadioGroup');
