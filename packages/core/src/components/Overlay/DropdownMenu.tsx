import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

import { Popover } from './Popover';

export interface MenuItem {
  readonly label: string;
  readonly onPress: () => void;
  /** Optional leading icon node. */
  readonly icon?: React.ReactNode;
  readonly destructive?: boolean;
  readonly disabled?: boolean;
}

export interface MenuListProps {
  readonly items: readonly MenuItem[];
  /** Called after an item's own `onPress` runs (used to close the menu). */
  readonly onSelect?: () => void;
}

/**
 * Shared menu-item renderer. Used by both DropdownMenu (anchored / press) and
 * ContextMenu (long-press) so the row layout, roles and disabled handling stay
 * identical across the two surfaces.
 */
export const MenuList = React.memo<MenuListProps>(function MenuList(props) {
  const { items, onSelect } = props;
  const tokens = useTokens();

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space.sm,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.sm,
    minHeight: 44,
    borderRadius: tokens.radii.sm,
  };

  return (
    <View accessibilityRole="menu">
      {items.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole="menuitem"
          accessibilityState={MENU_DISABLED_STATE[item.disabled ? 'on' : 'off']}
          disabled={item.disabled}
          onPress={
            item.disabled
              ? undefined
              : () => {
                  item.onPress();
                  if (onSelect) onSelect();
                }
          }
          style={({ pressed }) => [
            rowStyle,
            pressed ? { backgroundColor: tokens.colors.background.subtle } : undefined,
            item.disabled ? MENU_ROW_DISABLED : undefined,
          ]}
        >
          {item.icon ? <View>{item.icon}</View> : null}
          <Text tone={item.destructive ? 'danger' : 'primary'}>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
});
MenuList.displayName = 'MenuList';

export interface DropdownMenuProps {
  /** Element that opens the menu when pressed. */
  readonly trigger: React.ReactElement<{ onPress?: () => void }>;
  readonly items: readonly MenuItem[];
  readonly placement?: 'top' | 'bottom';
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Style applied to the elevated menu panel (not the trigger). */
  readonly style?: StyleProp<ViewStyle>;
}

const DropdownMenuImpl = React.forwardRef<View, DropdownMenuProps>(
  function DropdownMenu(props, ref) {
    const { trigger, items, placement = 'bottom', open, onOpenChange, style } = props;
    const [internalOpen, setInternalOpen] = React.useState(false);
    const isOpen = open ?? internalOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (open === undefined) setInternalOpen(next);
        if (onOpenChange) onOpenChange(next);
      },
      [open, onOpenChange],
    );

    const close = React.useCallback(() => setOpen(false), [setOpen]);
    const toggle = React.useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

    // Wrap the caller's trigger so pressing it opens the menu, without
    // discarding any onPress the caller already attached.
    const wrappedTrigger = React.cloneElement(trigger, {
      onPress: composePress(trigger.props.onPress, toggle),
    });

    return (
      <Popover
        ref={ref}
        visible={isOpen}
        onClose={close}
        placement={placement}
        trigger={wrappedTrigger}
        style={style}
      >
        <MenuList items={items} onSelect={close} />
      </Popover>
    );
  },
);

function composePress(existing: (() => void) | undefined, added: () => void): () => void {
  return () => {
    if (existing) existing();
    added();
  };
}

// Hoisted: token-free, caller-independent style fragments.
const MENU_ROW_DISABLED = { opacity: 0.4 } as const;
const MENU_DISABLED_STATE = {
  on: { disabled: true } as const,
  off: { disabled: false } as const,
};

DropdownMenuImpl.displayName = 'DropdownMenu';

export const DropdownMenu = tagComponent(React.memo(DropdownMenuImpl), 'DropdownMenu');
