import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Label, Text } from '../Text/Text';

import { Popover } from './Popover';

export interface MegaMenuItem {
  readonly label: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

export interface MegaMenuSection {
  readonly title?: string;
  readonly items: readonly MegaMenuItem[];
}

export interface MegaMenuProps {
  /** Element that opens the menu when pressed. */
  readonly trigger: React.ReactElement<{ onPress?: () => void }>;
  readonly sections: readonly MegaMenuSection[];
  readonly placement?: 'top' | 'bottom';
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Style applied to the elevated menu panel (not the trigger). */
  readonly style?: StyleProp<ViewStyle>;
}

interface ColumnProps {
  readonly section: MegaMenuSection;
  readonly onSelect: () => void;
}

const Column = React.memo<ColumnProps>(function Column({ section, onSelect }) {
  const tokens = useTokens();

  const columnStyle: ViewStyle = { minWidth: 160, gap: tokens.space['2xs'] };
  const titleStyle: ViewStyle = { marginBottom: tokens.space['2xs'] };
  const rowStyle: ViewStyle = {
    paddingVertical: tokens.space.xs,
    paddingHorizontal: tokens.space.xs,
    borderRadius: tokens.radii.sm,
    minHeight: 36,
    justifyContent: 'center',
  };

  return (
    <View style={columnStyle} accessibilityRole="menu">
      {section.title ? (
        <View style={titleStyle}>
          <Label tone="muted">{section.title}</Label>
        </View>
      ) : null}
      {section.items.map((item) => (
        <Pressable
          key={item.label}
          accessibilityRole="menuitem"
          accessibilityState={MENU_STATE[item.disabled ? 'on' : 'off']}
          disabled={item.disabled}
          onPress={
            item.disabled
              ? undefined
              : () => {
                  item.onPress();
                  onSelect();
                }
          }
          style={({ pressed }) => [
            rowStyle,
            pressed ? { backgroundColor: tokens.colors.background.subtle } : undefined,
            item.disabled ? ROW_DISABLED : undefined,
          ]}
        >
          <Text>{item.label}</Text>
        </Pressable>
      ))}
    </View>
  );
});
Column.displayName = 'MegaMenuColumn';

/**
 * Wide, multi-column dropdown menu for web-oriented navigation. Composes
 * Popover for positioning / the elevated surface and lays the sections out as
 * a wrapping row of titled columns.
 */
const MegaMenuImpl = React.forwardRef<View, MegaMenuProps>(function MegaMenu(props, ref) {
  const { trigger, sections, placement = 'bottom', open, onOpenChange, style } = props;
  const tokens = useTokens();
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

  const wrappedTrigger = React.cloneElement(trigger, {
    onPress: composePress(trigger.props.onPress, toggle),
  });

  const gridStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.space.lg,
    maxWidth: 720,
  };
  const panelStyle: ViewStyle = { minWidth: 320 };

  return (
    <Popover
      ref={ref}
      visible={isOpen}
      onClose={close}
      placement={placement}
      trigger={wrappedTrigger}
      style={[panelStyle, style]}
    >
      <View style={gridStyle}>
        {sections.map((section, i) => (
          <Column key={section.title ?? `section-${i}`} section={section} onSelect={close} />
        ))}
      </View>
    </Popover>
  );
});

function composePress(existing: (() => void) | undefined, added: () => void): () => void {
  return () => {
    if (existing) existing();
    added();
  };
}

// Hoisted: token-free, caller-independent fragments.
const ROW_DISABLED = { opacity: 0.4 } as const;
const MENU_STATE = {
  on: { disabled: true } as const,
  off: { disabled: false } as const,
};

MegaMenuImpl.displayName = 'MegaMenu';

export const MegaMenu = tagComponent(React.memo(MegaMenuImpl), 'MegaMenu');
