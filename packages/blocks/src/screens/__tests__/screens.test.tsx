import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import type { AnalyticsMetric } from '../../dashboard';
import type { NotificationData } from '../../social';
import {
  DashboardScreen,
  DetailsScreen,
  HelpScreen,
  HomeScreen,
  NoInternetScreen,
  NotFoundScreen,
  NotificationsScreen,
  OnboardingScreen,
  PricingScreen,
  type PricingPlan,
  ProfileScreen,
  SearchResultsScreen,
  type SearchResult,
  SettingsScreen,
  UnauthorizedScreen,
  WalkthroughScreens,
  type WalkthroughStep,
} from '../index';

const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const metrics: AnalyticsMetric[] = [
  { id: 'rev', label: 'Revenue', value: '$12.4k', delta: '+12%', trend: 'up' },
  { id: 'users', label: 'Users', value: '1,204', delta: '-3%', trend: 'down' },
];

const notifications: NotificationData[] = [
  { id: 'n1', text: 'Alex started following you', time: '2h', name: 'Alex', unread: true },
  { id: 'n2', text: 'Your export is ready', time: '1d', name: 'System' },
];

const steps: WalkthroughStep[] = [
  { title: 'Welcome', body: 'Get started in seconds.' },
  { title: 'Stay in sync', body: 'Everything updates live.' },
  { title: 'You are set', body: 'Enjoy the app.' },
];

const plans: PricingPlan[] = [
  { name: 'Free', price: '$0', period: '/mo', features: ['1 project', 'Community support'] },
  {
    name: 'Pro',
    price: '$12',
    period: '/mo',
    features: ['Unlimited projects', 'Priority support'],
    cta: 'Upgrade',
    highlighted: true,
  },
];

interface DemoResult extends SearchResult {
  readonly title: string;
}

const results: DemoResult[] = [
  { id: 'r1', title: 'First result' },
  { id: 'r2', title: 'Second result' },
];

describe('screen blocks — render without throwing', () => {
  it('renders HomeScreen (with and without header)', () => {
    expect(() =>
      renderWithTheme(
        <HomeScreen header={<Text>Header</Text>}>
          <Text>Body</Text>
        </HomeScreen>,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<HomeScreen />)).not.toThrow();
  });

  it('renders DashboardScreen (with and without metrics)', () => {
    expect(() =>
      renderWithTheme(
        <DashboardScreen metrics={metrics} onPressMetric={noop}>
          <Text>Section</Text>
        </DashboardScreen>,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<DashboardScreen />)).not.toThrow();
  });

  it('renders DetailsScreen (with back, footer, and minimal)', () => {
    expect(() =>
      renderWithTheme(
        <DetailsScreen title="Order #1024" subtitle="Paid" onBack={noop} footer={<Text>Pay</Text>}>
          <Text>Detail content</Text>
        </DetailsScreen>,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<DetailsScreen title="Plain" />)).not.toThrow();
  });

  it('renders SettingsScreen', () => {
    expect(() =>
      renderWithTheme(
        <SettingsScreen
          onBack={noop}
          groups={[
            {
              title: 'Account',
              items: [
                { label: 'Profile', onPress: noop },
                { label: 'Security', onPress: noop },
              ],
            },
          ]}
        />,
      ),
    ).not.toThrow();
  });

  it('renders ProfileScreen', () => {
    expect(() =>
      renderWithTheme(
        <ProfileScreen
          user={{ name: 'Jamie Rivera', handle: '@jamie', bio: 'Builder.' }}
          stats={[
            { id: 'f', label: 'Followers', value: '1.2k' },
            { id: 'g', label: 'Following', value: '320' },
          ]}
          onEdit={noop}
        >
          <Text>Tab content</Text>
        </ProfileScreen>,
      ),
    ).not.toThrow();
  });

  it('renders NotificationsScreen (list and empty)', () => {
    expect(() =>
      renderWithTheme(<NotificationsScreen notifications={notifications} onPressItem={noop} />),
    ).not.toThrow();
    expect(() => renderWithTheme(<NotificationsScreen notifications={[]} />)).not.toThrow();
  });

  it('renders SearchResultsScreen (results and empty)', () => {
    expect(() =>
      renderWithTheme(
        <SearchResultsScreen<DemoResult>
          query="res"
          results={results}
          onChangeQuery={noop}
          renderResult={(item) => <Text>{item.title}</Text>}
        />,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<SearchResultsScreen query="none" results={[]} />)).not.toThrow();
  });

  it('renders OnboardingScreen (full and minimal)', () => {
    expect(() =>
      renderWithTheme(
        <OnboardingScreen
          title="Welcome"
          body="Let's get you set up."
          illustration={<View />}
          onNext={noop}
          onSkip={noop}
        />,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<OnboardingScreen title="Hello" />)).not.toThrow();
  });

  it('renders WalkthroughScreens', () => {
    expect(() =>
      renderWithTheme(<WalkthroughScreens steps={steps} onDone={noop} onSkip={noop} />),
    ).not.toThrow();
  });

  it('renders HelpScreen (with and without contact)', () => {
    const faqs = [
      { question: 'How do I reset my password?', answer: 'Use the forgot password link.' },
      { question: 'Where are my invoices?', answer: 'Under Settings > Billing.' },
    ];
    expect(() => renderWithTheme(<HelpScreen faqs={faqs} onContactSupport={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<HelpScreen faqs={faqs} />)).not.toThrow();
  });

  it('renders NotFoundScreen (with and without action)', () => {
    expect(() => renderWithTheme(<NotFoundScreen onGoHome={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<NotFoundScreen />)).not.toThrow();
  });

  it('renders UnauthorizedScreen (with and without action)', () => {
    expect(() => renderWithTheme(<UnauthorizedScreen onSignIn={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<UnauthorizedScreen />)).not.toThrow();
  });

  it('renders NoInternetScreen (with and without retry)', () => {
    expect(() => renderWithTheme(<NoInternetScreen onRetry={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<NoInternetScreen />)).not.toThrow();
  });

  it('renders PricingScreen (with toggle and without)', () => {
    expect(() =>
      renderWithTheme(
        <PricingScreen plans={plans} showBillingToggle onSelectPlan={noop} onChangeCycle={noop} />,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<PricingScreen plans={plans} />)).not.toThrow();
  });
});
