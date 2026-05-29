import { Button, HStack, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

/** A single bulk action button shown in the toolbar. */
export interface BulkAction {
  /** Stable machine key. */
  readonly key: string;
  /** Button label. */
  readonly label: string;
  /** Renders the button with a danger tone (e.g. delete). */
  readonly destructive?: boolean;
  /** Fired when the action is pressed. */
  readonly onPress: () => void;
}

export interface BulkActionsProps {
  /** Number of currently-selected items. When 0, nothing renders. */
  readonly selectedCount: number;
  /** Actions to expose for the selection. */
  readonly actions: readonly BulkAction[];
  /** Fired when the clear-selection control is pressed. Hidden when absent. */
  readonly onClear?: () => void;
  /**
   * Builds the selection summary label. Defaults to "N selected".
   * Useful for i18n / pluralization.
   */
  readonly renderCount?: (count: number) => string;
  /** Style spread onto the root toolbar. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  count: { flexShrink: 1 },
  spacer: { flex: 1 },
});

function defaultRenderCount(count: number): string {
  return `${count} selected`;
}

const ActionButtonImpl = React.forwardRef<View, { readonly action: BulkAction }>(
  function ActionButton(props, ref) {
    const { action } = props;
    return (
      <Button
        ref={ref}
        size="sm"
        variant={action.destructive ? 'solid' : 'outline'}
        tone={action.destructive ? 'danger' : 'neutral'}
        onPress={action.onPress}
      >
        {action.label}
      </Button>
    );
  },
);
ActionButtonImpl.displayName = 'BulkActionButton';
const ActionButton = React.memo(ActionButtonImpl);

const BulkActionsImpl = React.forwardRef<View, BulkActionsProps>(function BulkActions(props, ref) {
  const { selectedCount, actions, onClear, renderCount = defaultRenderCount, style } = props;
  const tokens = useTokens();

  const barStyle = React.useMemo<ViewStyle>(
    () => ({
      ...staticStyles.bar,
      gap: tokens.space.xs,
      paddingHorizontal: tokens.space.md,
      paddingVertical: tokens.space.sm,
      backgroundColor: tokens.colors.background.subtle,
      borderRadius: tokens.radii.md,
    }),
    [tokens],
  );

  if (selectedCount <= 0) return null;

  return (
    <View
      ref={ref}
      accessibilityRole="toolbar"
      accessibilityLabel="Bulk actions"
      style={[barStyle, style]}
    >
      <Text weight="semibold" tone="primary" style={staticStyles.count}>
        {renderCount(selectedCount)}
      </Text>
      <View style={staticStyles.spacer} />
      <HStack gap="xs" align="center">
        {actions.map((action) => (
          <ActionButton key={action.key} action={action} />
        ))}
        {onClear ? (
          <Button size="sm" variant="ghost" tone="neutral" onPress={onClear}>
            Clear
          </Button>
        ) : null}
      </HStack>
    </View>
  );
});

BulkActionsImpl.displayName = 'BulkActions';

export const BulkActions = React.memo(BulkActionsImpl);
