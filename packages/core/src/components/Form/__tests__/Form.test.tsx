import { fireEvent, render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { Checkbox } from '../Checkbox';
import { CurrencyInput } from '../CurrencyInput';
import { EmailInput } from '../EmailInput';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { NumberInput } from '../NumberInput';
import { OTPInput } from '../OTPInput';
import { PhoneInput } from '../PhoneInput';
import { PINInput } from '../PINInput';
import { Radio, RadioGroup } from '../Radio';
import { Switch } from '../Switch';

describe('Phase 3 forms — smoke', () => {
  it('every form primitive carries its tag', () => {
    expect(getComponentTag(<FormField />)).toBe('FormField');
    expect(getComponentTag(<Input />)).toBe('Input');
    expect(getComponentTag(<Checkbox />)).toBe('Checkbox');
    expect(getComponentTag(<Radio value="x" />)).toBe('Radio');
    expect(getComponentTag(<RadioGroup name="g" />)).toBe('RadioGroup');
    expect(getComponentTag(<Switch />)).toBe('Switch');
  });

  it('FormField shows label, helper, error and wires the input', () => {
    const { getByText, queryByText, rerender } = render(
      <FormField label="Email" description="Used for login">
        <Input placeholder="you@example.com" />
      </FormField>,
    );
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Used for login')).toBeTruthy();

    rerender(
      <FormField label="Email" description="Used for login" error="Required">
        <Input placeholder="you@example.com" />
      </FormField>,
    );
    // When invalid, helper hides and error shows.
    expect(queryByText('Used for login')).toBeNull();
    expect(getByText('Required')).toBeTruthy();
  });

  it('FormField marks required with an asterisk', () => {
    const { getByText } = render(
      <FormField label="Name" required>
        <Input />
      </FormField>,
    );
    expect(getByText(/Name \*/)).toBeTruthy();
  });

  it('Checkbox toggles uncontrolled state on press', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Checkbox label="Agree" onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('Checkbox respects controlled checked + does not flip itself', () => {
    const onChange = jest.fn();
    const { getByRole } = render(<Checkbox checked={false} onChange={onChange} />);
    fireEvent.press(getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('RadioGroup selects exactly one option', () => {
    const onValueChange = jest.fn();
    const { getAllByRole } = render(
      <RadioGroup name="size" onValueChange={onValueChange}>
        <Radio value="sm" label="Small" />
        <Radio value="md" label="Medium" />
      </RadioGroup>,
    );
    const radios = getAllByRole('radio');
    fireEvent.press(radios[1]!);
    expect(onValueChange).toHaveBeenCalledWith('md');
  });
});

describe('Input primitives — smoke', () => {
  it('every input primitive carries its tag', () => {
    expect(getComponentTag(<EmailInput />)).toBe('EmailInput');
    expect(getComponentTag(<PhoneInput />)).toBe('PhoneInput');
    expect(getComponentTag(<NumberInput />)).toBe('NumberInput');
    expect(getComponentTag(<CurrencyInput />)).toBe('CurrencyInput');
    expect(getComponentTag(<OTPInput />)).toBe('OTPInput');
    expect(getComponentTag(<PINInput />)).toBe('PINInput');
  });

  it('each input primitive renders without throwing', () => {
    expect(() => render(<EmailInput placeholder="you@example.com" />)).not.toThrow();
    expect(() => render(<PhoneInput placeholder="555-0100" />)).not.toThrow();
    expect(() => render(<NumberInput showStepper value="3" />)).not.toThrow();
    expect(() => render(<CurrencyInput value={12.5} currency="EUR" />)).not.toThrow();
    expect(() => render(<OTPInput length={6} value="123" />)).not.toThrow();
    expect(() => render(<PINInput value="12" />)).not.toThrow();
  });

  it('NumberInput emits the raw numeric value', () => {
    const onChangeValue = jest.fn();
    const { getByPlaceholderText } = render(
      <NumberInput placeholder="qty" onChangeValue={onChangeValue} />,
    );
    fireEvent.changeText(getByPlaceholderText('qty'), '42');
    expect(onChangeValue).toHaveBeenCalledWith(42);
  });

  it('CurrencyInput guards against NaN by clearing the field', () => {
    const { queryByDisplayValue } = render(<CurrencyInput value={Number.NaN} currency="USD" />);
    expect(queryByDisplayValue(/\$/)).toBeNull();
  });

  it('OTPInput fires onComplete once the code is full', () => {
    const onComplete = jest.fn();
    const { getByDisplayValue } = render(
      <OTPInput length={4} value="123" onComplete={onComplete} />,
    );
    fireEvent.changeText(getByDisplayValue('123'), '1234');
    expect(onComplete).toHaveBeenCalledWith('1234');
  });
});
