import * as React from 'react';
import { type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Input, type InputProps } from './Input';

export interface CurrencyInputProps extends Omit<
  InputProps,
  'keyboardType' | 'value' | 'onChangeText'
> {
  /** Numeric value, in major units (e.g. 12.5 for $12.50). `NaN` clears the field. */
  readonly value?: number;
  /** ISO 4217 currency code. Defaults to 'USD'. */
  readonly currency?: string;
  /** BCP 47 locale used for formatting. Defaults to the runtime default. */
  readonly locale?: string;
  /** Raw parsed numeric value. `NaN` when the field is empty or unparseable. */
  readonly onChangeValue?: (value: number) => void;
}

// Keep only digits, a single sign, and a single decimal separator so the
// parser never sees the formatted symbols/group separators we render.
function parseNumeric(text: string): number {
  const cleaned = text.replace(/[^0-9.-]/g, '');
  if (cleaned === '' || cleaned === '-' || cleaned === '.' || cleaned === '-.') return NaN;
  return Number(cleaned);
}

const CurrencyInputImpl = React.forwardRef<TextInput, CurrencyInputProps>(
  function CurrencyInput(props, ref) {
    const { value, currency = 'USD', locale, onChangeValue, ...rest } = props;
    const [focused, setFocused] = React.useState(false);
    const [draft, setDraft] = React.useState('');

    const formatter = React.useMemo(
      () => new Intl.NumberFormat(locale, { style: 'currency', currency }),
      [locale, currency],
    );

    const hasValue = typeof value === 'number' && !Number.isNaN(value);
    const formatted = hasValue ? formatter.format(value) : '';
    // While focused show the raw editable draft; when blurred show the
    // formatted currency string so groupings/symbol don't fight the caret.
    const display = focused ? draft : formatted;

    const handleChangeText = React.useCallback(
      (text: string) => {
        setDraft(text);
        onChangeValue?.(parseNumeric(text));
      },
      [onChangeValue],
    );

    const handleFocus = React.useCallback(() => {
      setFocused(true);
      setDraft(hasValue ? String(value) : '');
    }, [hasValue, value]);

    const handleBlur = React.useCallback(() => {
      setFocused(false);
    }, []);

    return (
      <Input
        ref={ref}
        keyboardType="numeric"
        value={display}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    );
  },
);

CurrencyInputImpl.displayName = 'CurrencyInput';

export const CurrencyInput = tagComponent(CurrencyInputImpl, 'CurrencyInput');
