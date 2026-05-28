import * as React from 'react';
import { Pressable, type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { MenuList, type MenuItem } from './DropdownMenu';
import { Popover } from './Popover';

export interface ContextMenuProps {
  /** Element that opens the menu on long-press. */
  readonly children: React.ReactNode;
  readonly items: readonly MenuItem[];
  readonly placement?: 'top' | 'bottom';
  /** Long-press delay in ms before the menu opens. Default 400. */
  readonly delayLongPress?: number;
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Style applied to the elevated menu panel (not the trigger). */
  readonly style?: StyleProp<ViewStyle>;
}

const ContextMenuImpl = React.forwardRef<View, ContextMenuProps>(function ContextMenu(props, ref) {
  const {
    children,
    items,
    placement = 'bottom',
    delayLongPress = 400,
    open,
    onOpenChange,
    style,
  } = props;
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
  const openMenu = React.useCallback(() => setOpen(true), [setOpen]);

  const trigger = (
    <Pressable onLongPress={openMenu} delayLongPress={delayLongPress} accessibilityRole="button">
      {children}
    </Pressable>
  );

  return (
    <Popover
      ref={ref}
      visible={isOpen}
      onClose={close}
      placement={placement}
      trigger={trigger}
      style={style}
    >
      <MenuList items={items} onSelect={close} />
    </Popover>
  );
});

ContextMenuImpl.displayName = 'ContextMenu';

export const ContextMenu = tagComponent(React.memo(ContextMenuImpl), 'ContextMenu');
