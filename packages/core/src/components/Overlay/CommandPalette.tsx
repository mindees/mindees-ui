import * as React from 'react';
import {
  Pressable,
  ScrollView,
  View,
  type StyleProp,
  type View as RNView,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { SearchInput } from '../Form/SearchInput';
import { Label, Text } from '../Text/Text';

import { Modal } from './Modal';

export interface Command {
  readonly id: string;
  readonly label: string;
  readonly onRun: () => void;
  /** Optional group heading the command is filed under. */
  readonly group?: string;
}

export interface CommandPaletteProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly commands: readonly Command[];
  /** Search field placeholder. Default `Type a command…`. */
  readonly placeholder?: string;
  /** Copy shown when the filter matches nothing. Default `No commands found`. */
  readonly emptyLabel?: string;
  readonly accessibilityLabel?: string;
  /** Style applied to the elevated palette panel (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

interface CommandRowProps {
  readonly command: Command;
  readonly onRun: (command: Command) => void;
}

const CommandRow = React.memo<CommandRowProps>(function CommandRow({ command, onRun }) {
  const tokens = useTokens();
  const handlePress = React.useCallback(() => onRun(command), [onRun, command]);

  const rowStyle: ViewStyle = {
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.sm,
    minHeight: 44,
    justifyContent: 'center',
    borderRadius: tokens.radii.sm,
  };

  return (
    <Pressable
      accessibilityRole="menuitem"
      onPress={handlePress}
      style={({ pressed }) => [
        rowStyle,
        pressed ? { backgroundColor: tokens.colors.background.subtle } : undefined,
      ]}
    >
      <Text>{command.label}</Text>
    </Pressable>
  );
});
CommandRow.displayName = 'CommandRow';

/**
 * Cmd/Ctrl-K style command palette. Composes Modal with a search field and a
 * filtered, optionally grouped command list. Filtering is a case-insensitive
 * substring match on the label; running a command closes the palette.
 */
const CommandPaletteImpl = React.forwardRef<RNView, CommandPaletteProps>(
  function CommandPalette(props, ref) {
    const {
      visible,
      onClose,
      commands,
      placeholder = 'Type a command…',
      emptyLabel = 'No commands found',
      accessibilityLabel = 'Command palette',
      style,
    } = props;
    const tokens = useTokens();
    const [query, setQuery] = React.useState('');

    // Clear the query each time the palette reopens for a fresh search.
    React.useEffect(() => {
      if (visible) setQuery('');
    }, [visible]);

    const filtered = React.useMemo(() => {
      const q = query.trim().toLowerCase();
      if (q.length === 0) return commands;
      return commands.filter((c) => c.label.toLowerCase().includes(q));
    }, [query, commands]);

    // Stable group order, preserving first-seen sequence.
    const groups = React.useMemo(() => {
      const order: string[] = [];
      const byGroup = new Map<string, Command[]>();
      for (const c of filtered) {
        const key = c.group ?? '';
        let bucket = byGroup.get(key);
        if (!bucket) {
          bucket = [];
          byGroup.set(key, bucket);
          order.push(key);
        }
        bucket.push(c);
      }
      return order.map((key) => ({ key, items: byGroup.get(key) ?? [] }));
    }, [filtered]);

    const runCommand = React.useCallback(
      (command: Command) => {
        command.onRun();
        onClose();
      },
      [onClose],
    );

    const listStyle: ViewStyle = { marginTop: tokens.space.md, maxHeight: 320 };
    const groupHeadingStyle: ViewStyle = {
      paddingHorizontal: tokens.space.sm,
      paddingTop: tokens.space.sm,
      paddingBottom: tokens.space['2xs'],
    };
    const emptyStyle: ViewStyle = { padding: tokens.space.md, alignItems: 'center' };

    return (
      <Modal
        ref={ref}
        visible={visible}
        onClose={onClose}
        centered
        accessibilityLabel={accessibilityLabel}
        style={style}
      >
        <View accessibilityViewIsModal accessibilityRole="none">
          <SearchInput
            value={query}
            onChangeText={setQuery}
            onClear={CLEAR_QUERY_NOOP}
            placeholder={placeholder}
            autoFocus
            accessibilityLabel={placeholder}
          />
          <ScrollView
            style={listStyle}
            keyboardShouldPersistTaps="handled"
            accessibilityRole="menu"
          >
            {filtered.length === 0 ? (
              <View style={emptyStyle}>
                <Text tone="muted">{emptyLabel}</Text>
              </View>
            ) : (
              groups.map((group) => (
                <View key={group.key || '__ungrouped__'}>
                  {group.key ? (
                    <View style={groupHeadingStyle}>
                      <Label tone="muted">{group.key}</Label>
                    </View>
                  ) : null}
                  {group.items.map((command) => (
                    <CommandRow key={command.id} command={command} onRun={runCommand} />
                  ))}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  },
);

// SearchInput owns its own text via the controlled `value`; clearing is driven
// by `onChangeText('')`, so the dedicated clear handler is intentionally inert.
const CLEAR_QUERY_NOOP = (): void => undefined;

CommandPaletteImpl.displayName = 'CommandPalette';

export const CommandPalette = tagComponent(React.memo(CommandPaletteImpl), 'CommandPalette');
