import { ThemeProvider, type SettingsMenuGroup } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import {
  AccountSettings,
  AvatarUploader,
  BillingDetails,
  DeleteAccountFlow,
  InvoiceList,
  PasswordChangeForm,
  PaymentMethods,
  PrivacySettings,
  ProfileCard,
  ProfileEditor,
  SecuritySettings,
  SubscriptionCard,
  type BillingDetail,
  type Invoice,
  type PaymentMethod,
  type PrivacyToggleItem,
  type ProfileStat,
  type ProfileUser,
  type SecurityItem,
} from '../index';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const user: ProfileUser = {
  name: 'Avery Stone',
  handle: '@avery',
  bio: 'Designer & maker. Building delightful things.',
  avatar: 'https://example.com/avery.jpg',
};

const stats: ProfileStat[] = [
  { id: 'followers', label: 'Followers', value: '1.2k' },
  { id: 'following', label: 'Following', value: '340' },
  { id: 'posts', label: 'Posts', value: '87' },
];

const settingsGroups: SettingsMenuGroup[] = [
  {
    title: 'Account',
    items: [
      { label: 'Profile', onPress: noop },
      { label: 'Notifications', onPress: noop },
    ],
  },
  {
    title: 'Support',
    items: [{ label: 'Help center', onPress: noop, disabled: true }],
  },
];

const privacyItems: PrivacyToggleItem[] = [
  {
    id: 'private',
    label: 'Private account',
    description: 'Only approved followers.',
    value: true,
    onChange: noop,
  },
  { id: 'activity', label: 'Show activity status', value: false, onChange: noop, disabled: true },
];

const securityItems: SecurityItem[] = [
  {
    kind: 'toggle',
    id: '2fa',
    label: 'Two-factor authentication',
    description: 'Extra sign-in step.',
    value: false,
    onChange: noop,
  },
  {
    kind: 'action',
    id: 'password',
    label: 'Password',
    description: 'Last changed 3 months ago.',
    actionLabel: 'Change',
    onPress: noop,
  },
  { kind: 'action', id: 'sessions', label: 'Active sessions', onPress: noop },
];

const billingDetails: BillingDetail[] = [
  { id: 'name', label: 'Name', value: 'Avery Stone' },
  { id: 'email', label: 'Email', value: 'avery@example.com' },
  { id: 'address', label: 'Address', value: '123 Market St, San Francisco' },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'pm1', brand: 'Visa', last4: '4242', expiry: '08/27', isDefault: true },
  { id: 'pm2', brand: 'Mastercard', last4: '4444', expiry: '01/26' },
];

const invoices: Invoice[] = [
  { id: 'inv1', date: 'May 1, 2026', amount: '$12.00', status: 'paid' },
  { id: 'inv2', date: 'Apr 1, 2026', amount: '$12.00', status: 'pending' },
  { id: 'inv3', date: 'Mar 1, 2026', amount: '$12.00', status: 'failed' },
  { id: 'inv4', date: 'Feb 1, 2026', amount: '$12.00', status: 'refunded' },
];

describe('account blocks — render without throwing', () => {
  it('renders ProfileCard (full)', () => {
    expect(() =>
      renderWithTheme(<ProfileCard user={user} stats={stats} onEdit={noop} />),
    ).not.toThrow();
  });

  it('renders ProfileCard (minimal — no handle/bio/stats/edit)', () => {
    expect(() => renderWithTheme(<ProfileCard user={{ name: 'Sam' }} />)).not.toThrow();
  });

  it('renders ProfileEditor', () => {
    expect(() =>
      renderWithTheme(
        <ProfileEditor
          value={{ name: 'Avery', handle: 'avery', bio: 'Hi', avatar: 'x' }}
          onSave={noop}
          onCancel={noop}
          onPickAvatar={noop}
        />,
      ),
    ).not.toThrow();
  });

  it('renders ProfileEditor (loading, no cancel)', () => {
    expect(() =>
      renderWithTheme(
        <ProfileEditor value={{ name: '', handle: '', bio: '' }} onSave={noop} loading />,
      ),
    ).not.toThrow();
  });

  it('renders AvatarUploader (with pick, loading, plain)', () => {
    expect(() =>
      renderWithTheme(<AvatarUploader uri="x" name="Avery Stone" onPick={noop} />),
    ).not.toThrow();
    expect(() =>
      renderWithTheme(<AvatarUploader name="Avery Stone" onPick={noop} loading />),
    ).not.toThrow();
    expect(() => renderWithTheme(<AvatarUploader name="Avery Stone" />)).not.toThrow();
  });

  it('renders AccountSettings', () => {
    expect(() => renderWithTheme(<AccountSettings groups={settingsGroups} />)).not.toThrow();
  });

  it('renders PrivacySettings', () => {
    expect(() => renderWithTheme(<PrivacySettings items={privacyItems} />)).not.toThrow();
  });

  it('renders SecuritySettings', () => {
    expect(() => renderWithTheme(<SecuritySettings items={securityItems} />)).not.toThrow();
  });

  it('renders PasswordChangeForm (plain and with error)', () => {
    expect(() => renderWithTheme(<PasswordChangeForm onSubmit={noop} />)).not.toThrow();
    expect(() =>
      renderWithTheme(<PasswordChangeForm onSubmit={noop} error="Incorrect password" loading />),
    ).not.toThrow();
  });

  it('renders SubscriptionCard', () => {
    expect(() =>
      renderWithTheme(
        <SubscriptionCard
          plan={{
            name: 'Pro',
            price: '$12 / mo',
            renewalDate: 'Renews Jun 12, 2026',
            status: 'Active',
          }}
          onManage={noop}
        />,
      ),
    ).not.toThrow();
  });

  it('renders SubscriptionCard (minimal)', () => {
    expect(() =>
      renderWithTheme(<SubscriptionCard plan={{ name: 'Free', price: '$0' }} />),
    ).not.toThrow();
  });

  it('renders BillingDetails', () => {
    expect(() =>
      renderWithTheme(<BillingDetails details={billingDetails} onEdit={noop} />),
    ).not.toThrow();
  });

  it('renders PaymentMethods', () => {
    expect(() =>
      renderWithTheme(
        <PaymentMethods
          methods={paymentMethods}
          onAdd={noop}
          onRemove={noop}
          onSetDefault={noop}
        />,
      ),
    ).not.toThrow();
  });

  it('renders PaymentMethods (read-only, no actions)', () => {
    expect(() => renderWithTheme(<PaymentMethods methods={paymentMethods} />)).not.toThrow();
  });

  it('renders InvoiceList (each status)', () => {
    expect(() =>
      renderWithTheme(<InvoiceList invoices={invoices} onDownload={noop} />),
    ).not.toThrow();
  });

  it('renders InvoiceList (no download)', () => {
    expect(() => renderWithTheme(<InvoiceList invoices={invoices} />)).not.toThrow();
  });

  it('renders DeleteAccountFlow (closed dialog by default)', () => {
    expect(() => renderWithTheme(<DeleteAccountFlow onDelete={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<DeleteAccountFlow onDelete={noop} loading />)).not.toThrow();
  });
});
