import {
  Caption,
  Button,
  Checkbox,
  EmailInput,
  FormField,
  Input,
  PasswordInput,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

/** Values produced when the user submits the signup form. */
export interface SignupFormValues {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly acceptedTerms: boolean;
}

export interface SignupFormProps {
  /** Called with the collected values when the form is submitted. */
  readonly onSubmit: (values: SignupFormValues) => void;
  /** Disables inputs and shows a spinner on the submit button. */
  readonly loading?: boolean;
  /** Top-level error message, announced to a11y. */
  readonly error?: string;
  /** Label rendered next to the terms checkbox. */
  readonly termsLabel?: React.ReactNode;
  /** Label for the submit button. Defaults to "Create account". */
  readonly submitLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_TERMS = 'I agree to the Terms of Service and Privacy Policy';

const SignupFormImpl = React.forwardRef<View, SignupFormProps>(function SignupForm(props, ref) {
  const {
    onSubmit,
    loading = false,
    error,
    termsLabel = DEFAULT_TERMS,
    submitLabel = 'Create account',
    style,
  } = props;

  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);

  const handleSubmit = React.useCallback(() => {
    onSubmit({
      name: name.trim(),
      email: email.trim(),
      password,
      confirmPassword,
      acceptedTerms,
    });
  }, [name, email, password, confirmPassword, acceptedTerms, onSubmit]);

  return (
    <VStack ref={ref} gap="md" style={style}>
      {error ? (
        <Caption tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
          {error}
        </Caption>
      ) : null}

      <FormField label="Name">
        <Input
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          disabled={loading}
          returnKeyType="next"
          accessibilityLabel="Name"
        />
      </FormField>

      <FormField label="Email">
        <EmailInput
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          disabled={loading}
          returnKeyType="next"
          accessibilityLabel="Email"
        />
      </FormField>

      <FormField label="Password">
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          autoComplete="new-password"
          textContentType="newPassword"
          disabled={loading}
          returnKeyType="next"
          accessibilityLabel="Password"
        />
      </FormField>

      <FormField label="Confirm password">
        <PasswordInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          textContentType="newPassword"
          disabled={loading}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Confirm password"
        />
      </FormField>

      <Checkbox
        checked={acceptedTerms}
        onChange={setAcceptedTerms}
        disabled={loading}
        label={termsLabel}
        accessibilityLabel="Accept terms and conditions"
      />

      <Button onPress={handleSubmit} loading={loading} fullWidth>
        {submitLabel}
      </Button>
    </VStack>
  );
});

SignupFormImpl.displayName = 'SignupForm';

export const SignupForm = React.memo(SignupFormImpl);
