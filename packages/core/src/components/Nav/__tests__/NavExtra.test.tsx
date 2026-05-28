import { render } from '@testing-library/react-native';
import * as React from 'react';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { BottomNavigation } from '../BottomNavigation';
import { GlobalSearch } from '../GlobalSearch';
import { SettingsMenu } from '../SettingsMenu';
import { UserMenu } from '../UserMenu';

// Stable noop avoids the empty-function lint rule firing on inline arrows.
const noop = (): void => undefined;

const wrap = (ui: React.ReactElement): React.ReactElement => <ThemeProvider>{ui}</ThemeProvider>;

const navItems = [
  { key: 'home', label: 'Home' },
  { key: 'profile', label: 'Profile' },
];

describe('nav-extra — tag identity', () => {
  it('carries the right tag for each new primitive', () => {
    expect(
      getComponentTag(<BottomNavigation items={navItems} value="home" onChange={noop} />),
    ).toBe('BottomNavigation');
    expect(getComponentTag(<UserMenu user={{ name: 'Ada Lovelace' }} items={[]} />)).toBe(
      'UserMenu',
    );
    expect(getComponentTag(<SettingsMenu groups={[]} />)).toBe('SettingsMenu');
    expect(getComponentTag(<GlobalSearch onSearch={noop} />)).toBe('GlobalSearch');
  });
});

describe('nav-extra — renders without throwing', () => {
  it('BottomNavigation (active item)', () => {
    expect(() =>
      render(wrap(<BottomNavigation items={navItems} value="home" onChange={noop} />)),
    ).not.toThrow();
  });

  it('UserMenu (with avatar + actions)', () => {
    expect(() =>
      render(
        wrap(
          <UserMenu
            user={{ name: 'Ada Lovelace', avatar: 'https://example.com/a.png' }}
            items={[
              { label: 'Profile', onPress: noop },
              { label: 'Sign out', onPress: noop, destructive: true },
            ]}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('SettingsMenu (grouped rows with chevrons and right content)', () => {
    expect(() =>
      render(
        wrap(
          <SettingsMenu
            groups={[
              {
                title: 'Account',
                items: [
                  { label: 'Profile', onPress: noop },
                  { label: 'Notifications', onPress: noop, right: <></> },
                ],
              },
              {
                items: [{ label: 'Sign out', onPress: noop, disabled: true }],
              },
            ]}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('GlobalSearch (open with results)', () => {
    expect(() =>
      render(
        wrap(
          <GlobalSearch
            open
            onSearch={noop}
            results={[
              { key: '1', label: 'First result', description: 'A match', onPress: noop },
              { key: '2', label: 'Second result', onPress: noop },
            ]}
          />,
        ),
      ),
    ).not.toThrow();
  });
});
