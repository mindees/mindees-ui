import * as React from 'react';

import { FormFieldContext, type FormFieldContextValue } from '../layout-intelligence/context';

export interface FormFieldA11y extends FormFieldContextValue {
  /**
   * Pass to the input's `accessibilityLabelledBy` prop. Resolves to the
   * `nativeID` the parent FormField gave its visible label.
   */
  readonly accessibilityLabelledBy: string;
  /**
   * Pass to the input's `accessibilityDescribedBy`. Concatenates the
   * description id + error id (when invalid) so screen readers read both.
   */
  readonly accessibilityDescribedBy: string;
}

/**
 * Reads `FormFieldContext` and returns the ready-to-spread a11y props for
 * an input nested inside `<FormField>`. Returns `undefined` outside a
 * FormField so standalone inputs don't get bogus `accessibilityLabelledBy`
 * values.
 *
 * @example
 * const a11y = useFormFieldA11y();
 * <TextInput
 *   nativeID={a11y?.id}
 *   accessibilityLabelledBy={a11y?.accessibilityLabelledBy}
 *   accessibilityDescribedBy={a11y?.accessibilityDescribedBy}
 *   editable={!a11y?.disabled}
 * />
 */
export function useFormFieldA11y(): FormFieldA11y | undefined {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) return undefined;
  return {
    ...ctx,
    accessibilityLabelledBy: ctx.labelId,
    accessibilityDescribedBy: ctx.invalid
      ? `${ctx.descriptionId} ${ctx.errorId}`.trim()
      : ctx.descriptionId,
  };
}
