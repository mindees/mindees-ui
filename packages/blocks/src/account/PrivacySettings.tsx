import { Caption, Divider, HStack, Switch, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** A single privacy toggle row. */
export interface PrivacyToggleItem {
  /** Stable identity for list rendering and switch handlers. */
  readonly id: string;
  readonly label: string;
  /** Optional supporting copy under the label. */
  readonly description?: string;
  readonly value: boolean;
  /** Called with the next value when the switch is toggled. */
  readonly onChange: (next: boolean) => void;
  readonly disabled?: boolean;
}

export interface PrivacySettingsProps {
  /** Toggle rows to render. */
  readonly items: readonly PrivacyToggleItem[];
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { alignItems: 'center' },
  text: { flexShrink: 1 },
});

interface ToggleRowProps {
  readonly item: PrivacyToggleItem;
}

const ToggleRow = React.memo(function ToggleRow({ item }: ToggleRowProps) {
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

ToggleRow.displayName = 'PrivacySettings.ToggleRow';

const PrivacySettingsImpl = React.forwardRef<View, PrivacySettingsProps>(
  function PrivacySettings(props, ref) {
    const { items, style } = props;
    return (
      <VStack ref={ref} gap="sm" style={style}>
        {items.map((item, index) => (
          <React.Fragment key={item.id}>
            {index > 0 ? <Divider /> : null}
            <ToggleRow item={item} />
          </React.Fragment>
        ))}
      </VStack>
    );
  },
);

PrivacySettingsImpl.displayName = 'PrivacySettings';

export const PrivacySettings = React.memo(PrivacySettingsImpl);
