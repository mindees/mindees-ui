import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text } from 'react-native';

import { FormFieldContext, type FormFieldContextValue } from '../../layout-intelligence/context';
import { useFormFieldA11y, type FormFieldA11y } from '../useFormFieldA11y';

function Probe() {
  const a11y = useFormFieldA11y();
  return <Text testID="probe">{JSON.stringify(a11y)}</Text>;
}

function withCtx(value: FormFieldContextValue): React.ReactElement {
  return (
    <FormFieldContext.Provider value={value}>
      <Probe />
    </FormFieldContext.Provider>
  );
}

const baseCtx: FormFieldContextValue = {
  id: 'field-1',
  labelId: 'field-1-label',
  descriptionId: 'field-1-desc',
  errorId: 'field-1-err',
  invalid: false,
  disabled: false,
  required: false,
};

describe('useFormFieldA11y', () => {
  it('returns undefined when no FormFieldContext is provided', () => {
    const { getByTestId } = render(<Probe />);
    expect(getByTestId('probe').props.children).toBeUndefined();
  });

  it('returns labelledBy = labelId and describedBy = descriptionId when valid', () => {
    const { getByTestId } = render(withCtx(baseCtx));
    const out = JSON.parse(getByTestId('probe').props.children as string) as FormFieldA11y;
    expect(out.accessibilityLabelledBy).toBe('field-1-label');
    expect(out.accessibilityDescribedBy).toBe('field-1-desc');
  });

  it('appends the error id to describedBy when invalid', () => {
    const { getByTestId } = render(withCtx({ ...baseCtx, invalid: true }));
    const out = JSON.parse(getByTestId('probe').props.children as string) as FormFieldA11y;
    expect(out.accessibilityDescribedBy).toContain('field-1-desc');
    expect(out.accessibilityDescribedBy).toContain('field-1-err');
  });

  it('passes through disabled / required / id', () => {
    const { getByTestId } = render(withCtx({ ...baseCtx, disabled: true, required: true }));
    const out = JSON.parse(getByTestId('probe').props.children as string) as FormFieldA11y;
    expect(out.disabled).toBe(true);
    expect(out.required).toBe(true);
    expect(out.id).toBe('field-1');
  });
});
