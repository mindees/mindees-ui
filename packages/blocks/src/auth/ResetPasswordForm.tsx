import { Button, Caption, FormField, PasswordInput, VStack } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

/** Values produced when the user sets a new password. */
export interface ResetPasswordFormValues {
  readonly password: string;
  readonly confirmPassword: string;
}

export interface ResetPasswordFormProps {
  /** Called with the new password and its confirmation when submitted. */
  readonly onSubmit: (values: ResetPasswordFormValues) => void;
  /** Disables inputs and shows a spinner on the submit button. */
  readonly loading?: boolean;
  /** Top-level error message, announced to a11y. */
  readonly error?: string;
  /** Label for the submit button. Defaults to "Reset password". */
  readonly submitLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const ResetPasswordFormImpl = React.forwardRef<View, ResetPasswordFormProps>(
  function ResetPasswordForm(props, ref) {
    const { onSubmit, loading = false, error, submitLabel = 'Reset password', style } = props;

    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    const handleSubmit = React.useCallback(() => {
      onSubmit({ password, confirmPassword });
    }, [password, confirmPassword, onSubmit]);

    return (
      <VStack ref={ref} gap="md" style={style}>
        {error ? (
          <Caption tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Caption>
        ) : null}

        <FormField label="New password">
          <PasswordInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter a new password"
            autoComplete="new-password"
            textContentType="newPassword"
            disabled={loading}
            returnKeyType="next"
            accessibilityLabel="New password"
          />
        </FormField>

        <FormField label="Confirm password">
          <PasswordInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your new password"
            autoComplete="new-password"
            textContentType="newPassword"
            disabled={loading}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Confirm password"
          />
        </FormField>

        <Button onPress={handleSubmit} loading={loading} fullWidth>
          {submitLabel}
        </Button>
      </VStack>
    );
  },
);

ResetPasswordFormImpl.displayName = 'ResetPasswordForm';

export const ResetPasswordForm = React.memo(ResetPasswordFormImpl);
