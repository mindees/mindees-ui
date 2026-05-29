import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import {
  CookieBanner,
  type FooterGroup,
  type NavLink,
  PWAInstallPrompt,
  ResponsiveNavbar,
  WebFooter,
} from '../index';

const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const links: NavLink[] = [
  { label: 'Home', onPress: noop },
  { label: 'Pricing', onPress: noop },
  { label: 'Docs', onPress: noop },
];

const groups: FooterGroup[] = [
  {
    title: 'Product',
    links: [
      { label: 'Features', onPress: noop },
      { label: 'Pricing', onPress: noop },
    ],
  },
  {
    title: 'Company',
    links: [{ label: 'About', onPress: noop }],
  },
];

describe('web blocks — render without throwing', () => {
  it('renders CookieBanner (full and minimal)', () => {
    expect(() =>
      renderWithTheme(
        <CookieBanner onAccept={noop} onDecline={noop} onManage={noop} message="Custom notice." />,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<CookieBanner onAccept={noop} />)).not.toThrow();
  });

  it('renders ResponsiveNavbar (wide layout with cta and logo)', () => {
    expect(() =>
      renderWithTheme(
        <ResponsiveNavbar
          links={links}
          logo={<Text>Logo</Text>}
          cta={{ label: 'Sign up', onPress: noop }}
        />,
      ),
    ).not.toThrow();
  });

  it('renders ResponsiveNavbar (forced collapsed)', () => {
    expect(() =>
      renderWithTheme(<ResponsiveNavbar links={links} collapseBelow={100000} />),
    ).not.toThrow();
  });

  it('renders WebFooter (with and without copyright)', () => {
    expect(() =>
      renderWithTheme(<WebFooter groups={groups} copyright="© 2026 Acme, Inc." />),
    ).not.toThrow();
    expect(() => renderWithTheme(<WebFooter groups={groups} />)).not.toThrow();
  });

  it('renders PWAInstallPrompt (full and minimal)', () => {
    expect(() =>
      renderWithTheme(
        <PWAInstallPrompt
          onInstall={noop}
          onDismiss={noop}
          icon={<View />}
          title="Install Acme"
          description="Get the app."
        />,
      ),
    ).not.toThrow();
    expect(() => renderWithTheme(<PWAInstallPrompt onInstall={noop} />)).not.toThrow();
  });
});
