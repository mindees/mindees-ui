import {
  Box,
  Button,
  Caption,
  EmailInput,
  FormField,
  Link,
  PasswordInput,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

/** Values produced when the user submits the login form. */
export interface LoginFormValues {
  readonly email: string;
  readonly password: string;
}

export interface LoginFormProps {
  /** Called with the trimmed email and raw password when the form is submitted. */
  readonly onSubmit: (values: LoginFormValues) => void;
  /** Disables inputs and shows a spinner on the submit button. */
  readonly loading?: boolean;
  /** Top-level error message (e.g. "Invalid credentials"), announced to a11y. */
  readonly error?: string;
  /** Shows a "Forgot password?" link when provided. */
  readonly onForgotPassword?: () => void;
  /** Slot rendered below the submit button — e.g. a SocialLoginButtons row. */
  readonly footer?: React.ReactNode;
  /** Label for the submit button. Defaults to "Sign in". */
  readonly submitLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const LoginFormImpl = React.forwardRef<View, LoginFormProps>(function LoginForm(props, ref) {
  const {
    onSubmit,
    loading = false,
    error,
    onForgotPassword,
    footer,
    submitLabel = 'Sign in',
    style,
  } = props;

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = React.useCallback(() => {
    onSubmit({ email: email.trim(), password });
  }, [email, password, onSubmit]);

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
          returnKeyType="next"
          accessibilityLabel="Email"
        />
      </FormField>

      <FormField label="Password">
        <PasswordInput
          value={password}
          onChangeText={setPassword}
          placeholder="Your password"
          disabled={loading}
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Password"
        />
      </FormField>

      {onForgotPassword ? (
        <Box style={FORGOT_ROW_STYLE}>
          <Link onPress={onForgotPassword} variant="bodySm">
            Forgot password?
          </Link>
        </Box>
      ) : null}

      <Button onPress={handleSubmit} loading={loading} fullWidth>
        {submitLabel}
      </Button>

      {footer}
    </VStack>
  );
});

const FORGOT_ROW_STYLE: ViewStyle = { alignItems: 'flex-end' };

LoginFormImpl.displayName = 'LoginForm';

export const LoginForm = React.memo(LoginFormImpl);
