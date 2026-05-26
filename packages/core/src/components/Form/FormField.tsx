import * as React from 'react';
import { View, type ViewProps } from 'react-native';

import { useUniqueId } from '../../a11y/useUniqueId';
import { FormFieldContext, type FormFieldContextValue } from '../../layout-intelligence/context';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Box } from '../Box/Box';
import { Caption, Label } from '../Text/Text';

export interface FormFieldProps extends ViewProps {
  readonly children?: React.ReactNode;
  readonly label?: string;
  readonly description?: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

/**
 * Wraps a form input + its label + helper/error text. Publishes a
 * `FormFieldContext` so nested inputs (read via `useFormFieldA11y`) auto-wire
 * `accessibilityLabelledBy` / `accessibilityDescribedBy` / `invalid` props.
 *
 * Tag: not assigned (FormField is a structural wrapper; downstream inputs
 * keep their own tags). Renders the label, child input, helper, and error
 * in a vertical stack with semantic spacing.
 */
const FormFieldImpl = React.forwardRef<View, FormFieldProps>(function FormField(props, ref) {
  const {
    children,
    label,
    description,
    error,
    required = false,
    disabled = false,
    style,
    ...rest
  } = props;
  const id = useUniqueId('field');
  const labelId = `${id}-label`;
  const descriptionId = `${id}-desc`;
  const errorId = `${id}-err`;
  const invalid = Boolean(error);

  const ctx: FormFieldContextValue = React.useMemo(
    () => ({ id, labelId, descriptionId, errorId, invalid, disabled, required }),
    [id, labelId, descriptionId, errorId, invalid, disabled, required],
  );

  return (
    <FormFieldContext.Provider value={ctx}>
      <Box ref={ref} style={style} {...rest}>
        {label ? (
          <Label nativeID={labelId} accessibilityRole="text">
            {label}
            {required ? ' *' : ''}
          </Label>
        ) : null}
        <View>{children}</View>
        {description && !invalid ? (
          <Caption nativeID={descriptionId} tone="muted">
            {description}
          </Caption>
        ) : null}
        {error ? (
          <Caption nativeID={errorId} tone="danger" accessibilityRole="text">
            {error}
          </Caption>
        ) : null}
      </Box>
    </FormFieldContext.Provider>
  );
});

FormFieldImpl.displayName = 'FormField';

export const FormField = tagComponent(FormFieldImpl, 'FormField');
