import { Button, Caption, EmailInput, FormField, Link, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

/** Values produced when the user requests a password reset. */
export interface ForgotPasswordFormValues {
  readonly email: string;
}

export interface ForgotPasswordFormProps {
  /** Called with the trimmed email when the form is submitted. */
  readonly onSubmit: (values: ForgotPasswordFormValues) => void;
  /** Disables inputs and shows a spinner on the submit button. */
  readonly loading?: boolean;
  /** Top-level error message, announced to a11y. */
  readonly error?: string;
  /** When true, renders the success confirmation instead of the form. */
  readonly sent?: boolean;
  /** Shows a "Back to sign in" link when provided. */
  readonly onBack?: () => void;
  /** Label for the submit button. Defaults to "Send reset link". */
  readonly submitLabel?: string;
  /** Message shown in the success (`sent`) state. */
  readonly sentMessage?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_SENT_MESSAGE = 'If an account exists for that address, a reset link is on its way.';

const ForgotPasswordFormImpl = React.forwardRef<View, ForgotPasswordFormProps>(
  function ForgotPasswordForm(props, ref) {
    const {
      onSubmit,
      loading = false,
      error,
      sent = false,
      onBack,
      submitLabel = 'Send reset link',
      sentMessage = DEFAULT_SENT_MESSAGE,
      style,
    } = props;

    const [email, setEmail] = React.useState('');

    const handleSubmit = React.useCallback(() => {
      onSubmit({ email: email.trim() });
    }, [email, onSubmit]);

    const backLink = onBack ? (
      <Link onPress={onBack} variant="bodySm">
        Back to sign in
      </Link>
    ) : null;

    if (sent) {
      return (
        <VStack ref={ref} gap="md" style={style}>
          <Text tone="success" accessibilityRole="alert" accessibilityLiveRegion="polite">
            {sentMessage}
          </Text>
          {backLink}
        </VStack>
      );
    }

    return (
      <VStack ref={ref} gap="md" style={style}>
        {error ? (
          <Caption tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Caption>
        ) : null}

        <FormField label="Email">
          <EmailInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            disabled={loading}
            returnKeyType="done"
            onSubmitEditing={handleSubmit}
            accessibilityLabel="Email"
          />
        </FormField>

        <Button onPress={handleSubmit} loading={loading} fullWidth>
          {submitLabel}
        </Button>

        {backLink}
      </VStack>
    );
  },
);

ForgotPasswordFormImpl.displayName = 'ForgotPasswordForm';

export const ForgotPasswordForm = React.memo(ForgotPasswordFormImpl);
