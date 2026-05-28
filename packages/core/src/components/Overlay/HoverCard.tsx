import * as React from 'react';
import { Platform, Pressable, type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Popover } from './Popover';

export interface HoverCardProps {
  /** Element that reveals the card. */
  readonly trigger: React.ReactElement;
  /** Floating card body. */
  readonly content: React.ReactNode;
  readonly placement?: 'top' | 'bottom';
  /** Long-press delay (native only) in ms. Default 300. */
  readonly delayLongPress?: number;
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Style applied to the elevated card panel (not the trigger). */
  readonly style?: StyleProp<ViewStyle>;
}

const IS_WEB = Platform.OS === 'web';

/**
 * Floating card revealed on pointer hover (web) or long-press (native — no
 * hover concept). Reuses Popover for positioning and the elevated surface.
 * Web hover binds `onHoverIn`/`onHoverOut`, which RN-Web maps to pointer
 * enter/leave; native falls back to long-press + tap-outside to dismiss.
 */
const HoverCardImpl = React.forwardRef<View, HoverCardProps>(function HoverCard(props, ref) {
  const {
    trigger,
    content,
    placement = 'bottom',
    delayLongPress = 300,
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
  const show = React.useCallback(() => setOpen(true), [setOpen]);
  const hide = React.useCallback(() => setOpen(false), [setOpen]);

  // Web: reveal on hover. Native: reveal on long-press (no hover concept).
  const wrappedTrigger = IS_WEB ? (
    <Pressable accessibilityRole="button" onHoverIn={show} onHoverOut={hide}>
      {trigger}
    </Pressable>
  ) : (
    <Pressable accessibilityRole="button" onLongPress={show} delayLongPress={delayLongPress}>
      {trigger}
    </Pressable>
  );

  return (
    <Popover
      ref={ref}
      visible={isOpen}
      onClose={close}
      placement={placement}
      trigger={wrappedTrigger}
      style={style}
    >
      {content}
    </Popover>
  );
});

HoverCardImpl.displayName = 'HoverCard';

export const HoverCard = tagComponent(React.memo(HoverCardImpl), 'HoverCard');
