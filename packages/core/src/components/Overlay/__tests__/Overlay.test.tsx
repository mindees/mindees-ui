import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Animated, Text as RNText } from 'react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { ActionSheet } from '../ActionSheet';
import { Alert } from '../Alert';
import { Banner } from '../Banner';
import { BottomSheet } from '../BottomSheet';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { ContextMenu } from '../ContextMenu';
import { Dialog } from '../Dialog';
import { Drawer } from '../Drawer';
import { DropdownMenu, type MenuItem } from '../DropdownMenu';
import { Modal } from '../Modal';
import { Notification } from '../Notification';
import { Popover } from '../Popover';
import { Snackbar } from '../Snackbar';
import { Toast } from '../Toast';
import { Tooltip } from '../Tooltip';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

describe('Phase 4 overlays — tag identity', () => {
  it('every overlay primitive carries its tag', () => {
    expect(getComponentTag(<Modal visible={false} onClose={noop} />)).toBe('Modal');
    expect(getComponentTag(<BottomSheet visible={false} onClose={noop} />)).toBe('BottomSheet');
    expect(getComponentTag(<Toast visible={false} message="x" />)).toBe('Toast');
    expect(
      getComponentTag(
        <Tooltip label="x">
          <></>
        </Tooltip>,
      ),
    ).toBe('Tooltip');
    expect(getComponentTag(<Popover visible={false} onClose={noop} trigger={<></>} />)).toBe(
      'Popover',
    );
    expect(getComponentTag(<Drawer visible={false} onClose={noop} />)).toBe('Drawer');
    expect(getComponentTag(<Alert visible={false} onClose={noop} title="x" />)).toBe('Alert');
    expect(getComponentTag(<ActionSheet visible={false} onClose={noop} items={[]} />)).toBe(
      'ActionSheet',
    );
  });
});

describe('overlays-extra — tag identity', () => {
  it('carries the right tag for each new primitive', () => {
    expect(getComponentTag(<Dialog visible={false} onClose={noop} title="x" />)).toBe('Dialog');
    expect(
      getComponentTag(
        <ConfirmationDialog visible={false} onClose={noop} title="x" onConfirm={noop} />,
      ),
    ).toBe('ConfirmationDialog');
    expect(getComponentTag(<Snackbar visible={false} message="x" />)).toBe('Snackbar');
    expect(getComponentTag(<Banner message="x" />)).toBe('Banner');
    expect(getComponentTag(<Notification visible={false} title="x" />)).toBe('Notification');
    expect(getComponentTag(<DropdownMenu trigger={<RNText>open</RNText>} items={[]} />)).toBe(
      'DropdownMenu',
    );
    expect(
      getComponentTag(
        <ContextMenu items={[]}>
          <RNText>target</RNText>
        </ContextMenu>,
      ),
    ).toBe('ContextMenu');
  });
});

describe('overlays-extra — renders without throwing', () => {
  // The native animated driver isn't installed in the JS test runtime, so a
  // real `useNativeDriver: true` timing throws on `.start()`. Stub the timing
  // factory to a no-op composite — we're asserting render safety, not motion.
  let timingSpy: jest.SpyInstance;
  beforeAll(() => {
    timingSpy = jest.spyOn(Animated, 'timing').mockReturnValue({
      start: noop,
      stop: noop,
      reset: noop,
    } as unknown as Animated.CompositeAnimation);
  });
  afterAll(() => {
    timingSpy.mockRestore();
  });

  const wrap = (ui: React.ReactElement): React.ReactElement => <ThemeProvider>{ui}</ThemeProvider>;
  const items: readonly MenuItem[] = [
    { label: 'Edit', onPress: noop },
    { label: 'Delete', onPress: noop, destructive: true },
  ];

  it('Dialog (visible)', () => {
    expect(() =>
      render(
        wrap(
          <Dialog visible onClose={noop} title="Title" description="Desc">
            <RNText>body</RNText>
          </Dialog>,
        ),
      ),
    ).not.toThrow();
  });

  it('ConfirmationDialog (visible, destructive)', () => {
    expect(() =>
      render(
        wrap(
          <ConfirmationDialog
            visible
            onClose={noop}
            title="Delete?"
            message="This cannot be undone."
            onConfirm={noop}
            onCancel={noop}
            destructive
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('Snackbar (visible, with action)', () => {
    expect(() =>
      render(wrap(<Snackbar visible message="Saved" action={{ label: 'Undo', onPress: noop }} />)),
    ).not.toThrow();
  });

  it('Banner (with action + dismiss)', () => {
    expect(() =>
      render(
        wrap(
          <Banner
            message="Heads up"
            tone="warning"
            action={{ label: 'Details', onPress: noop }}
            onDismiss={noop}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('Notification (visible, with actions)', () => {
    expect(() =>
      render(
        wrap(
          <Notification
            visible
            title="New message"
            body="You have one unread message."
            tone="info"
            actions={[{ label: 'Open', onPress: noop }]}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('DropdownMenu', () => {
    expect(() =>
      render(wrap(<DropdownMenu trigger={<RNText>Menu</RNText>} items={items} />)),
    ).not.toThrow();
  });

  it('ContextMenu', () => {
    expect(() =>
      render(
        wrap(
          <ContextMenu items={items}>
            <RNText>Long-press me</RNText>
          </ContextMenu>,
        ),
      ),
    ).not.toThrow();
  });
});
