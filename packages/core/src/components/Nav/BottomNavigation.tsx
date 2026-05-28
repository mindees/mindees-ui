import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface BottomNavigationItem {
  readonly key: string;
  readonly label: string;
  /** Optional icon node rendered above the label. */
  readonly icon?: React.ReactNode;
}

export interface BottomNavigationProps extends Omit<ViewProps, 'style'> {
  readonly items: readonly BottomNavigationItem[];
  /** Key of the currently active item. */
  readonly value: string;
  readonly onChange: (key: string) => void;
  /** Override the active tint. Defaults to `theme.colors.action.primary`. */
  readonly activeTint?: string;
  /** Respect the bottom safe-area inset. Defaults to true. */
  readonly safeArea?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

const ITEM_STYLE: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 44,
};

const BottomNavigationImpl = React.forwardRef<View, BottomNavigationProps>(
  function BottomNavigation(props, ref) {
    const { items, value, onChange, activeTint, safeArea = true, style, ...rest } = props;
    const tokens = useTokens();
    // Read the inset context directly so a missing `SafeAreaProvider` degrades
    // gracefully to a zero bottom inset instead of throwing.
    const insets = React.useContext(SafeAreaInsetsContext);
    const bottomInset = safeArea && insets ? insets.bottom : 0;
    const tint = activeTint ?? tokens.colors.action.primary;

    const containerStyle: ViewStyle = {
      flexDirection: 'row',
      backgroundColor: tokens.colors.background.elevated,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border.subtle,
      paddingTop: tokens.space.xs,
      paddingBottom: bottomInset + tokens.space.xs,
      paddingHorizontal: tokens.space.xs,
    };

    const handlePress = React.useCallback((key: string) => () => onChange(key), [onChange]);

    return (
      <View ref={ref} accessibilityRole="tablist" style={[containerStyle, style]} {...rest}>
        {items.map((item) => {
          const active = item.key === value;
          return (
            <Pressable
              key={item.key}
              accessibilityRole="tab"
              accessibilityLabel={item.label}
              accessibilityState={active ? ACTIVE_STATE : INACTIVE_STATE}
              onPress={handlePress(item.key)}
              style={ITEM_STYLE}
            >
              {item.icon ? <View>{item.icon}</View> : null}
              <Text
                variant="caption"
                weight={active ? 'semibold' : 'regular'}
                numberOfLines={1}
                style={{ color: active ? tint : tokens.colors.text.muted }}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  },
);

// Hoisted: caller-independent accessibility state fragments.
const ACTIVE_STATE = { selected: true } as const;
const INACTIVE_STATE = { selected: false } as const;

BottomNavigationImpl.displayName = 'BottomNavigation';

export const BottomNavigation = tagComponent(React.memo(BottomNavigationImpl), 'BottomNavigation');
