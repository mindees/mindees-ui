import { ChevronRightIcon } from '@mindees/icons';
import * as React from 'react';
import {
  Pressable,
  StyleSheet,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface SettingsMenuItem {
  readonly label: string;
  /** Optional leading icon node. */
  readonly icon?: React.ReactNode;
  readonly onPress: () => void;
  /** Optional trailing content (value text, switch, badge). Replaces the chevron when set. */
  readonly right?: React.ReactNode;
  readonly disabled?: boolean;
}

export interface SettingsMenuGroup {
  readonly title?: string;
  readonly items: readonly SettingsMenuItem[];
}

export interface SettingsMenuProps extends Omit<ViewProps, 'style'> {
  readonly groups: readonly SettingsMenuGroup[];
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_DISABLED: ViewStyle = { opacity: 0.4 };

const staticStyles = StyleSheet.create({
  label: { flex: 1 },
  groupTitle: { textTransform: 'uppercase' },
});

const SettingsMenuImpl = React.forwardRef<View, SettingsMenuProps>(
  function SettingsMenu(props, ref) {
    const { groups, style, ...rest } = props;
    const tokens = useTokens();

    const rowStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.space.sm,
      paddingHorizontal: tokens.space.md,
      paddingVertical: tokens.space.sm,
      minHeight: 48,
      backgroundColor: tokens.colors.background.elevated,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border.subtle,
    };

    return (
      <View ref={ref} accessibilityRole="menu" style={[{ gap: tokens.space.md }, style]} {...rest}>
        {groups.map((group, gi) => (
          <View key={group.title ?? `group-${gi}`}>
            {group.title ? (
              <Text
                variant="caption"
                tone="muted"
                weight="semibold"
                style={[
                  staticStyles.groupTitle,
                  {
                    paddingHorizontal: tokens.space.md,
                    paddingBottom: tokens.space['2xs'],
                  },
                ]}
              >
                {group.title}
              </Text>
            ) : null}
            {group.items.map((item) => (
              <Pressable
                key={item.label}
                accessibilityRole="menuitem"
                accessibilityLabel={item.label}
                accessibilityState={{ disabled: item.disabled === true }}
                disabled={item.disabled}
                onPress={item.disabled ? undefined : item.onPress}
                style={({ pressed }) => [
                  rowStyle,
                  pressed ? { backgroundColor: tokens.colors.background.subtle } : undefined,
                  item.disabled ? ROW_DISABLED : undefined,
                ]}
              >
                {item.icon ? <View>{item.icon}</View> : null}
                <Text tone="primary" style={staticStyles.label} numberOfLines={1}>
                  {item.label}
                </Text>
                {item.right !== undefined ? (
                  <View>{item.right}</View>
                ) : (
                  <ChevronRightIcon size={18} color={tokens.colors.text.muted} />
                )}
              </Pressable>
            ))}
          </View>
        ))}
      </View>
    );
  },
);

SettingsMenuImpl.displayName = 'SettingsMenu';

export const SettingsMenu = tagComponent(React.memo(SettingsMenuImpl), 'SettingsMenu');
