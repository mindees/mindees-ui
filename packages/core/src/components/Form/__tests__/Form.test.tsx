import { fireEvent, render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { Checkbox } from '../Checkbox';
import { FormField } from '../FormField';
import { Input } from '../Input';
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
