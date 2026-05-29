import { Box, EmptyState, ScreenWrapper, TopBar } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  type View,
  type ViewStyle,
} from 'react-native';

import { NotificationItem, type NotificationData } from '../social';

export interface NotificationsScreenProps {
  /** Notifications to render. An empty list shows the empty state. */
  readonly notifications: readonly NotificationData[];
  /** Header title. Defaults to "Notifications". */
  readonly title?: string;
  /** Trailing header slot (e.g. a "mark all read" action). */
  readonly headerTrailing?: React.ReactNode;
  /** Called with the notification id when a row is pressed. */
  readonly onPressItem?: (id: string) => void;
  /** Title shown in the empty state. Defaults to "No notifications". */
  readonly emptyTitle?: string;
  /** Description shown in the empty state. */
  readonly emptyDescription?: string;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  list: { flexGrow: 1 },
  state: { flex: 1 },
});

function keyExtractor(item: NotificationData): string {
  return item.id;
}

const NotificationsScreenImpl = React.forwardRef<View, NotificationsScreenProps>(
  function NotificationsScreen(props, ref) {
    const {
      notifications,
      title = 'Notifications',
      headerTrailing,
      onPressItem,
      emptyTitle = 'No notifications',
      emptyDescription = "You're all caught up.",
      style,
    } = props;

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<NotificationData>) => (
        <NotificationItem notification={item} onPress={onPressItem} />
      ),
      [onPressItem],
    );

    const empty = React.useMemo(
      () => (
        <EmptyState style={staticStyles.state} title={emptyTitle} description={emptyDescription} />
      ),
      [emptyTitle, emptyDescription],
    );

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          <TopBar title={title} trailing={headerTrailing} />
          <FlatList
            data={notifications}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            contentContainerStyle={staticStyles.list}
            ListEmptyComponent={empty}
          />
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

NotificationsScreenImpl.displayName = 'NotificationsScreen';

/** Notifications list: header + FlatList of NotificationItem + empty state. */
export const NotificationsScreen = React.memo(NotificationsScreenImpl);
