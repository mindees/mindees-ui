import {
  Avatar,
  Badge,
  type BadgeTone,
  Button,
  Caption,
  HStack,
  List,
  Text,
  useTokens,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

/** Account state of a managed user. */
export type UserStatus = 'active' | 'invited' | 'suspended';

/** A managed user row. */
export interface ManagedUser {
  /** Stable identity for list rendering. */
  readonly id: string;
  /** Display name. */
  readonly name: string;
  /** Email address. */
  readonly email: string;
  /** Human-readable role label, e.g. "Admin". */
  readonly role: string;
  /** Account state. */
  readonly status: UserStatus;
  /** Avatar image URL. Falls back to initials when absent. */
  readonly avatar?: string;
}

export interface UserManagementTableProps {
  /** Users to render. */
  readonly users: readonly ManagedUser[];
  /** Called with the user when its edit action is pressed. */
  readonly onEdit?: (user: ManagedUser) => void;
  /** Called with the user when its remove action is pressed. */
  readonly onRemove?: (user: ManagedUser) => void;
  /** Rendered when `users` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Header slot rendered above the list. */
  readonly ListHeaderComponent?: React.ComponentProps<typeof FlatList>['ListHeaderComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the list container. */
  readonly style?: StyleProp<ViewStyle>;
}

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'success',
  invited: 'info',
  suspended: 'danger',
};

const STATUS_LABEL: Record<UserStatus, string> = {
  active: 'Active',
  invited: 'Invited',
  suspended: 'Suspended',
};

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  identity: { flex: 1, minWidth: 0 },
  identityText: { flexShrink: 1 },
});

function keyExtractor(item: ManagedUser): string {
  return item.id;
}

interface UserRowProps {
  readonly user: ManagedUser;
  readonly onEdit?: (user: ManagedUser) => void;
  readonly onRemove?: (user: ManagedUser) => void;
  readonly rowStyle: ViewStyle;
}

const UserRowImpl = React.forwardRef<View, UserRowProps>(function UserRow(props, ref) {
  const { user, onEdit, onRemove, rowStyle } = props;

  const handleEdit = React.useCallback(() => onEdit?.(user), [onEdit, user]);
  const handleRemove = React.useCallback(() => onRemove?.(user), [onRemove, user]);

  return (
    <View ref={ref} accessibilityRole="none" style={rowStyle}>
      <HStack gap="sm" align="center" style={staticStyles.identity}>
        <Avatar src={user.avatar} name={user.name} size="sm" />
        <VStack gap="3xs" style={staticStyles.identityText}>
          <Text weight="medium" tone="primary" numberOfLines={1}>
            {user.name}
          </Text>
          <Caption tone="muted" numberOfLines={1}>
            {user.email}
          </Caption>
        </VStack>
      </HStack>

      <HStack gap="sm" align="center">
        <Caption tone="secondary" numberOfLines={1}>
          {user.role}
        </Caption>
        <Badge tone={STATUS_TONE[user.status]} variant="subtle">
          {STATUS_LABEL[user.status]}
        </Badge>
        {onEdit ? (
          <Button size="sm" variant="ghost" tone="neutral" onPress={handleEdit}>
            Edit
          </Button>
        ) : null}
        {onRemove ? (
          <Button size="sm" variant="ghost" tone="danger" onPress={handleRemove}>
            Remove
          </Button>
        ) : null}
      </HStack>
    </View>
  );
});
UserRowImpl.displayName = 'UserManagementRow';
const UserRow = React.memo(UserRowImpl);

const UserManagementTableImpl = React.forwardRef<FlatList<ManagedUser>, UserManagementTableProps>(
  function UserManagementTable(props, ref) {
    const {
      users,
      onEdit,
      onRemove,
      ListEmptyComponent,
      ListHeaderComponent,
      scrollEnabled = true,
      style,
    } = props;
    const tokens = useTokens();

    const rowStyle = React.useMemo<ViewStyle>(
      () => ({
        ...staticStyles.row,
        justifyContent: 'space-between',
        gap: tokens.space.sm,
        flexWrap: 'wrap',
        paddingHorizontal: tokens.space.md,
        paddingVertical: tokens.space.sm,
        minHeight: 56,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.border.subtle,
      }),
      [tokens],
    );

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<ManagedUser>) => (
        <UserRow user={item} onEdit={onEdit} onRemove={onRemove} rowStyle={rowStyle} />
      ),
      [onEdit, onRemove, rowStyle],
    );

    return (
      <List style={style}>
        <FlatList
          ref={ref}
          data={users}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
        />
      </List>
    );
  },
);

UserManagementTableImpl.displayName = 'UserManagementTable';

export const UserManagementTable = React.memo(UserManagementTableImpl);
