import { Button, Caption, FormField, PasswordInput, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

/** Values produced when the password change form is submitted. */
export interface PasswordChangeValues {
  readonly current: string;
  readonly next: string;
}

export interface PasswordChangeFormProps {
  /** Called with the current and new password when the form is submitted. */
  readonly onSubmit: (values: PasswordChangeValues) => void;
  /** Disables inputs and shows a spinner on the submit button. */
  readonly loading?: boolean;
  /** Top-level error message (e.g. "Current password is incorrect"). */
  readonly error?: string;
  /** Label for the submit button. Defaults to "Update password". */
  readonly submitLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const MISMATCH = 'Passwords do not match.';

const PasswordChangeFormImpl = React.forwardRef<View, PasswordChangeFormProps>(
  function PasswordChangeForm(props, ref) {
    const { onSubmit, loading = false, error, submitLabel = 'Update password', style } = props;

    const [current, setCurrent] = React.useState('');
    const [next, setNext] = React.useState('');
    const [confirm, setConfirm] = React.useState('');

    const mismatch = confirm.length > 0 && next !== confirm;
    const canSubmit = current.length > 0 && next.length > 0 && next === confirm && !loading;

    const handleSubmit = React.useCallback(() => {
      if (current.length === 0 || next.length === 0 || next !== confirm) return;
      onSubmit({ current, next });
    }, [current, next, confirm, onSubmit]);

    return (
      <VStack ref={ref} gap="md" style={style}>
        {error ? (
          <Caption tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Caption>
        ) : null}

        <FormField label="Current password">
          <PasswordInput
            value={current}
            onChangeText={setCurrent}
            placeholder="Current password"
            disabled={loading}
            autoComplete="current-password"
            returnKeyType="next"
            accessibilityLabel="Current password"
          />
        </FormField>

        <FormField label="New password">
          <PasswordInput
            value={next}
            onChangeText={setNext}
            placeholder="New password"
            disabled={loading}
            autoComplete="new-password"
            returnKeyType="next"
            accessibilityLabel="New password"
          />
        </FormField>

        <FormField label="Confirm new password" error={mismatch ? MISMATCH : undefined}>
          <PasswordInput
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Confirm new password"
            disabled={loading}
            autoComplete="new-password"
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Confirm new password"
          />
        </FormField>

        <Button onPress={handleSubmit} loading={loading} disabled={!canSubmit} fullWidth>
          {submitLabel}
        </Button>
      </VStack>
    );
  },
);

PasswordChangeFormImpl.displayName = 'PasswordChangeForm';

export const PasswordChangeForm = React.memo(PasswordChangeFormImpl);
