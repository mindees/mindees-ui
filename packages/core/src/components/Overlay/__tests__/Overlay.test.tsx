import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Animated, Text as RNText } from 'react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { ThemeProvider } from '../../../theme/ThemeProvider';
import { ActionSheet } from '../ActionSheet';
import { Alert } from '../Alert';
import { Banner } from '../Banner';
import { BottomSheet } from '../BottomSheet';
import { CommandPalette, type Command } from '../CommandPalette';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { ContextMenu } from '../ContextMenu';
import { Dialog } from '../Dialog';
import { Drawer } from '../Drawer';
import { DropdownMenu, type MenuItem } from '../DropdownMenu';
import { FullscreenOverlay } from '../FullscreenOverlay';
import { HoverCard } from '../HoverCard';
import { Lightbox } from '../Lightbox';
import { MegaMenu, type MegaMenuSection } from '../MegaMenu';
import { Modal } from '../Modal';
import { Notification } from '../Notification';
import { Popover } from '../Popover';
import { SidePanel } from '../SidePanel';
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

describe('overlays-final — tag identity', () => {
  it('carries the right tag for each final overlay primitive', () => {
    expect(getComponentTag(<SidePanel visible={false} onClose={noop} />)).toBe('SidePanel');
    expect(getComponentTag(<Lightbox visible={false} onClose={noop} images={[]} />)).toBe(
      'Lightbox',
    );
    expect(getComponentTag(<FullscreenOverlay visible={false} onClose={noop} />)).toBe(
      'FullscreenOverlay',
    );
    expect(
      getComponentTag(
        <HoverCard trigger={<RNText>hover</RNText>} content={<RNText>card</RNText>} />,
      ),
    ).toBe('HoverCard');
    expect(getComponentTag(<MegaMenu trigger={<RNText>open</RNText>} sections={[]} />)).toBe(
      'MegaMenu',
    );
    expect(getComponentTag(<CommandPalette visible={false} onClose={noop} commands={[]} />)).toBe(
      'CommandPalette',
    );
  });
});

describe('overlays-final — renders without throwing', () => {
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

  it('SidePanel (visible)', () => {
    expect(() =>
      render(
        wrap(
          <SidePanel visible onClose={noop} side="right">
            <RNText>panel</RNText>
          </SidePanel>,
        ),
      ),
    ).not.toThrow();
  });

  it('Lightbox (visible, multiple images)', () => {
    expect(() =>
      render(
        wrap(
          <Lightbox
            visible
            onClose={noop}
            images={[{ uri: 'https://example.com/a.png' }, { uri: 'https://example.com/b.png' }]}
            index={1}
          />,
        ),
      ),
    ).not.toThrow();
  });

  it('FullscreenOverlay (visible)', () => {
    expect(() =>
      render(
        wrap(
          <FullscreenOverlay visible onClose={noop}>
            <RNText>content</RNText>
          </FullscreenOverlay>,
        ),
      ),
    ).not.toThrow();
  });

  it('HoverCard', () => {
    expect(() =>
      render(
        wrap(
          <HoverCard trigger={<RNText>Hover me</RNText>} content={<RNText>Card body</RNText>} />,
        ),
      ),
    ).not.toThrow();
  });

  it('MegaMenu', () => {
    const sections: readonly MegaMenuSection[] = [
      { title: 'Products', items: [{ label: 'Phones', onPress: noop }] },
      { title: 'Support', items: [{ label: 'Docs', onPress: noop }] },
    ];
    expect(() =>
      render(wrap(<MegaMenu trigger={<RNText>Menu</RNText>} sections={sections} />)),
    ).not.toThrow();
  });

  it('CommandPalette (visible, grouped)', () => {
    const commands: readonly Command[] = [
      { id: 'new', label: 'New File', onRun: noop, group: 'File' },
      { id: 'open', label: 'Open File', onRun: noop, group: 'File' },
      { id: 'help', label: 'Help', onRun: noop },
    ];
    expect(() =>
      render(wrap(<CommandPalette visible onClose={noop} commands={commands} />)),
    ).not.toThrow();
  });
});
