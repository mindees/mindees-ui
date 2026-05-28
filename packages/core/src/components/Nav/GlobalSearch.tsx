import { SearchIcon } from '@mindees/icons';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { SearchInput } from '../Form/SearchInput';
import { Modal } from '../Overlay/Modal';
import { Text } from '../Text/Text';

export interface GlobalSearchResult {
  readonly key: string;
  readonly label: string;
  /** Optional secondary line. */
  readonly description?: string;
  readonly icon?: React.ReactNode;
  readonly onPress: () => void;
}

export interface GlobalSearchProps {
  /** Called as the query changes; use it to populate `results`. */
  readonly onSearch: (query: string) => void;
  readonly results?: readonly GlobalSearchResult[];
  /** Placeholder shown in both the trigger and the overlay input. */
  readonly placeholder?: string;
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Shown in the overlay when there is a query but no results. */
  readonly emptyMessage?: string;
  /** Style applied to the trigger (not the overlay). */
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 48,
};

const staticStyles = StyleSheet.create({
  flex: { flex: 1 },
  resultsList: { maxHeight: 360 },
});

const GlobalSearchImpl = React.forwardRef<View, GlobalSearchProps>(
  function GlobalSearch(props, ref) {
    const {
      onSearch,
      results,
      placeholder = 'Search…',
      open,
      onOpenChange,
      emptyMessage = 'No results',
      style,
    } = props;
    const tokens = useTokens();
    const [internalOpen, setInternalOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const isOpen = open ?? internalOpen;

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (open === undefined) setInternalOpen(next);
        if (onOpenChange) onOpenChange(next);
      },
      [open, onOpenChange],
    );

    const handleOpen = React.useCallback(() => setOpen(true), [setOpen]);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    const handleChange = React.useCallback(
      (next: string) => {
        setQuery(next);
        onSearch(next);
      },
      [onSearch],
    );

    const triggerStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.space.xs,
      paddingHorizontal: tokens.space.sm,
      minHeight: 40,
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.border.default,
      backgroundColor: tokens.colors.background.subtle,
    };

    const hasQuery = query.trim().length > 0;
    const list = results ?? EMPTY_RESULTS;

    return (
      <>
        <Pressable
          ref={ref}
          accessibilityRole="search"
          accessibilityLabel={placeholder}
          onPress={handleOpen}
          style={[triggerStyle, style]}
        >
          <SearchIcon size={18} color={tokens.colors.text.muted} />
          <Text tone="muted" numberOfLines={1} style={staticStyles.flex}>
            {placeholder}
          </Text>
        </Pressable>

        <Modal visible={isOpen} onClose={handleClose} centered={false} accessibilityLabel="Search">
          <View style={{ gap: tokens.space.md }}>
            <SearchInput
              value={query}
              onChangeText={handleChange}
              placeholder={placeholder}
              autoFocus
              onClear={() => handleChange('')}
            />
            <ScrollView
              keyboardShouldPersistTaps="handled"
              style={staticStyles.resultsList}
              accessibilityRole="list"
            >
              {list.length > 0 ? (
                list.map((item) => (
                  <Pressable
                    key={item.key}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    onPress={() => {
                      item.onPress();
                      handleClose();
                    }}
                    style={({ pressed }) => [
                      { ...ROW_STYLE, gap: tokens.space.sm, paddingVertical: tokens.space.sm },
                      pressed ? { backgroundColor: tokens.colors.background.subtle } : undefined,
                    ]}
                  >
                    {item.icon ? <View>{item.icon}</View> : null}
                    <View style={staticStyles.flex}>
                      <Text numberOfLines={1}>{item.label}</Text>
                      {item.description ? (
                        <Text variant="caption" tone="muted" numberOfLines={1}>
                          {item.description}
                        </Text>
                      ) : null}
                    </View>
                  </Pressable>
                ))
              ) : (
                <Text tone="muted" align="center" style={{ paddingVertical: tokens.space.lg }}>
                  {hasQuery ? emptyMessage : placeholder}
                </Text>
              )}
            </ScrollView>
          </View>
        </Modal>
      </>
    );
  },
);

// Hoisted: stable empty fallback so the render path never allocates a new array.
const EMPTY_RESULTS: readonly GlobalSearchResult[] = [];

GlobalSearchImpl.displayName = 'GlobalSearch';

export const GlobalSearch = tagComponent(React.memo(GlobalSearchImpl), 'GlobalSearch');
