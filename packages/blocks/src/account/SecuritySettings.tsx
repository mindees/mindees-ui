import { Button, Caption, Divider, HStack, Switch, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** A security row that flips a boolean (e.g. two-factor auth). */
export interface SecurityToggleItem {
  readonly kind: 'toggle';
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  readonly value: boolean;
  readonly onChange: (next: boolean) => void;
  readonly disabled?: boolean;
}

/** A security row that navigates / triggers an action (e.g. change password). */
export interface SecurityActionItem {
  readonly kind: 'action';
  readonly id: string;
  readonly label: string;
  readonly description?: string;
  /** Trailing button label. Defaults to "Manage". */
  readonly actionLabel?: string;
  readonly onPress: () => void;
  readonly disabled?: boolean;
}

export type SecurityItem = SecurityToggleItem | SecurityActionItem;

export interface SecuritySettingsProps {
  /** Mixed toggle / action rows for the security section. */
  readonly items: readonly SecurityItem[];
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { alignItems: 'center' },
  text: { flexShrink: 1 },
});

const ToggleRow = React.memo(function ToggleRow({ item }: { readonly item: SecurityToggleItem }) {
  const { id, label, description, value, onChange, disabled } = item;
  const handleChange = React.useCallback(
    (next: boolean) => {
      onChange(next);
    },
    [onChange],
  );
  return (
    <HStack gap="md" justify="space-between" style={staticStyles.row}>
      <VStack gap="3xs" style={staticStyles.text}>
        <Text>{label}</Text>
        {description ? <Caption tone="muted">{description}</Caption> : null}
      </VStack>
      <Switch
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
        accessibilityLabel={label}
        nativeID={id}
      />
    </HStack>
  );
});
ToggleRow.displayName = 'SecuritySettings.ToggleRow';

const ActionRow = React.memo(function ActionRow({ item }: { readonly item: SecurityActionItem }) {
  const { label, description, actionLabel = 'Manage', onPress, disabled } = item;
  return (
    <HStack gap="md" justify="space-between" style={staticStyles.row}>
      <VStack gap="3xs" style={staticStyles.text}>
        <Text>{label}</Text>
        {description ? <Caption tone="muted">{description}</Caption> : null}
      </VStack>
      <Button variant="ghost" tone="primary" size="sm" onPress={onPress} disabled={disabled}>
        {actionLabel}
      </Button>
    </HStack>
  );
});
ActionRow.displayName = 'SecuritySettings.ActionRow';

const SecuritySettingsImpl = React.forwardRef<View, SecuritySettingsProps>(
  function SecuritySettings(props, ref) {
    const { items, style } = props;
    return (
      <VStack ref={ref} gap="sm" style={style}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 ? <Divider /> : null}
            {item.kind === 'toggle' ? <ToggleRow item={item} /> : <ActionRow item={item} />}
          </React.Fragment>
        ))}
      </VStack>
    );
  },
);

SecuritySettingsImpl.displayName = 'SecuritySettings';

export const SecuritySettings = React.memo(SecuritySettingsImpl);
