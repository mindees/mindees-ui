import * as React from 'react';
import { Pressable, type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Avatar } from '../Display/Avatar';
import { DropdownMenu, type MenuItem } from '../Overlay/DropdownMenu';
import { Text } from '../Text/Text';

export interface UserMenuUser {
  readonly name: string;
  /** Avatar image URL or RN source. Falls back to initials when omitted. */
  readonly avatar?: string | { uri: string };
}

export interface UserMenuProps {
  readonly user: UserMenuUser;
  readonly items: readonly MenuItem[];
  /** Hide the name label, showing only the avatar. Defaults to false. */
  readonly compact?: boolean;
  readonly placement?: 'top' | 'bottom';
  /** Controlled open state. Omit to let the component manage it internally. */
  readonly open?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  /** Style applied to the trigger row (not the menu panel). */
  readonly style?: StyleProp<ViewStyle>;
}

const TRIGGER_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 44,
};

const UserMenuImpl = React.forwardRef<View, UserMenuProps>(function UserMenu(props, ref) {
  const { user, items, compact = false, placement = 'bottom', open, onOpenChange, style } = props;
  const tokens = useTokens();

  const trigger = (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Account menu for ${user.name}`}
      style={[{ ...TRIGGER_STYLE, gap: tokens.space.xs }, style]}
    >
      <Avatar src={user.avatar} name={user.name} size="sm" />
      {compact ? null : (
        <Text weight="medium" numberOfLines={1}>
          {user.name}
        </Text>
      )}
    </Pressable>
  );

  return (
    <DropdownMenu
      ref={ref}
      trigger={trigger}
      items={items}
      placement={placement}
      open={open}
      onOpenChange={onOpenChange}
    />
  );
});

UserMenuImpl.displayName = 'UserMenu';

export const UserMenu = tagComponent(React.memo(UserMenuImpl), 'UserMenu');
