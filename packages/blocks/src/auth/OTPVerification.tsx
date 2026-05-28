import { Button, Caption, Heading, Link, OTPInput, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

export interface OTPVerificationProps {
  /** Called with the entered code when the user presses verify (or on auto-complete). */
  readonly onVerify: (code: string) => void;
  /** Shows a "Resend code" link when provided. */
  readonly onResend?: () => void;
  /** Number of code digits. Defaults to 6. */
  readonly length?: number;
  /** Disables input and shows a spinner on the verify button. */
  readonly loading?: boolean;
  /** Top-level error message, announced to a11y. */
  readonly error?: string;
  /** Heading shown above the code field. */
  readonly title?: string;
  /** Supporting line under the heading (e.g. where the code was sent). */
  readonly description?: string;
  /** Verify when the final digit is entered. Defaults to true. */
  readonly verifyOnComplete?: boolean;
  /** Label for the verify button. Defaults to "Verify". */
  readonly submitLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_LENGTH = 6;

const OTPVerificationImpl = React.forwardRef<View, OTPVerificationProps>(
  function OTPVerification(props, ref) {
    const {
      onVerify,
      onResend,
      length = DEFAULT_LENGTH,
      loading = false,
      error,
      title = 'Enter verification code',
      description,
      verifyOnComplete = true,
      submitLabel = 'Verify',
      style,
    } = props;

    const [code, setCode] = React.useState('');

    const handleComplete = React.useCallback(
      (value: string) => {
        if (verifyOnComplete) onVerify(value);
      },
      [verifyOnComplete, onVerify],
    );

    const handleVerify = React.useCallback(() => {
      onVerify(code);
    }, [code, onVerify]);

    return (
      <VStack ref={ref} gap="md" style={style}>
        <Heading level={3}>{title}</Heading>
        {description ? <Text tone="secondary">{description}</Text> : null}

        {error ? (
          <Caption tone="danger" accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Caption>
        ) : null}

        <OTPInput
          length={length}
          value={code}
          onChangeText={setCode}
          onComplete={handleComplete}
          disabled={loading}
          accessibilityLabel="Verification code"
        />

        <Button onPress={handleVerify} loading={loading} disabled={code.length < length} fullWidth>
          {submitLabel}
        </Button>

        {onResend ? (
          <Link onPress={onResend} variant="bodySm">
            Resend code
          </Link>
        ) : null}
      </VStack>
    );
  },
);

OTPVerificationImpl.displayName = 'OTPVerification';

export const OTPVerification = React.memo(OTPVerificationImpl);
