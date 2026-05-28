import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import {
  ForgotPasswordForm,
  LoginForm,
  LogoutConfirmation,
  OTPVerification,
  ResetPasswordForm,
  SessionExpiredModal,
  SignupForm,
  SocialLoginButtons,
  type SocialProvider,
} from '../index';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe('auth blocks — render without throwing', () => {
  it('renders LoginForm', () => {
    expect(() =>
      renderWithTheme(<LoginForm onSubmit={noop} onForgotPassword={noop} />),
    ).not.toThrow();
  });

  it('renders LoginForm with error and footer', () => {
    expect(() =>
      renderWithTheme(
        <LoginForm onSubmit={noop} error="Invalid credentials" footer={null} loading />,
      ),
    ).not.toThrow();
  });

  it('renders SignupForm', () => {
    expect(() => renderWithTheme(<SignupForm onSubmit={noop} />)).not.toThrow();
  });

  it('renders SignupForm with error', () => {
    expect(() =>
      renderWithTheme(<SignupForm onSubmit={noop} error="Email already taken" loading />),
    ).not.toThrow();
  });

  it('renders ForgotPasswordForm', () => {
    expect(() =>
      renderWithTheme(<ForgotPasswordForm onSubmit={noop} onBack={noop} />),
    ).not.toThrow();
  });

  it('renders ForgotPasswordForm in the sent state', () => {
    expect(() =>
      renderWithTheme(<ForgotPasswordForm onSubmit={noop} onBack={noop} sent />),
    ).not.toThrow();
  });

  it('renders ResetPasswordForm', () => {
    expect(() =>
      renderWithTheme(<ResetPasswordForm onSubmit={noop} error="Passwords do not match" />),
    ).not.toThrow();
  });

  it('renders OTPVerification', () => {
    expect(() =>
      renderWithTheme(
        <OTPVerification onVerify={noop} onResend={noop} length={6} description="Sent to you" />,
      ),
    ).not.toThrow();
  });

  it('renders OTPVerification with error', () => {
    expect(() =>
      renderWithTheme(<OTPVerification onVerify={noop} error="Incorrect code" loading />),
    ).not.toThrow();
  });

  it('renders SocialLoginButtons (vertical)', () => {
    const providers: SocialProvider[] = [
      { key: 'google', label: 'Continue with Google', onPress: noop },
      { key: 'apple', label: 'Continue with Apple', onPress: noop },
    ];
    expect(() => renderWithTheme(<SocialLoginButtons providers={providers} />)).not.toThrow();
  });

  it('renders SocialLoginButtons (grid)', () => {
    const providers: SocialProvider[] = [
      { key: 'google', label: 'Google', onPress: noop },
      { key: 'apple', label: 'Apple', onPress: noop },
    ];
    expect(() =>
      renderWithTheme(<SocialLoginButtons providers={providers} layout="grid" columns={2} />),
    ).not.toThrow();
  });

  it('renders LogoutConfirmation (hidden)', () => {
    expect(() =>
      renderWithTheme(<LogoutConfirmation visible={false} onConfirm={noop} onCancel={noop} />),
    ).not.toThrow();
  });

  it('renders SessionExpiredModal (hidden)', () => {
    expect(() =>
      renderWithTheme(
        <SessionExpiredModal visible={false} onReauthenticate={noop} onDismiss={noop} />,
      ),
    ).not.toThrow();
  });

  it('renders SessionExpiredModal without onDismiss (hidden)', () => {
    expect(() =>
      renderWithTheme(<SessionExpiredModal visible={false} onReauthenticate={noop} />),
    ).not.toThrow();
  });
});
