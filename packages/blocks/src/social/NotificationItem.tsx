import { Avatar, Caption, HStack, Text, VStack, useTokens } from '@mindees/ui';
import * as React from 'react';
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

/** A single notification entry. */
export interface NotificationData {
  /** Stable identity. */
  readonly id: string;
  /** Primary notification text. */
  readonly text: string;
  /** Pre-formatted relative time, e.g. "2h". */
  readonly time?: string;
  /** Avatar image URL of the actor. Falls back to initials from `name`. */
  readonly avatar?: string;
  /** Actor name, used for the avatar fallback + a11y. */
  readonly name?: string;
  /** When true, an unread dot is shown and the row is emphasised. */
  readonly unread?: boolean;
}

export interface NotificationItemProps {
  /** Notification to render. */
  readonly notification: NotificationData;
  /** Called with the notification id when pressed. */
  readonly onPress?: (id: string) => void;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4 },
});

const NotificationItemImpl = React.forwardRef<View, NotificationItemProps>(
  function NotificationItem(props, ref) {
    const { notification, onPress, style } = props;
    const { id, text, time, avatar, name, unread = false } = notification;
    const tokens = useTokens();

    const handlePress = React.useCallback(() => {
      onPress?.(id);
    }, [onPress, id]);

    const containerStyle: ViewStyle = {
      paddingHorizontal: tokens.space.sm,
      paddingVertical: tokens.space.xs,
      backgroundColor: unread ? tokens.colors.status.infoSubtle : 'transparent',
      borderRadius: tokens.radii.md,
    };
    const dotColor: ViewStyle = { backgroundColor: tokens.colors.action.primary };

    const content = (
      <HStack gap="sm" align="center" style={containerStyle}>
        <Avatar src={avatar} name={name} size="md" />
        <VStack gap="3xs" style={staticStyles.grow}>
          <Text variant="bodySm" weight={unread ? 'semibold' : 'regular'} numberOfLines={3}>
            {text}
          </Text>
          {time ? (
            <Caption tone="muted" numberOfLines={1}>
              {time}
            </Caption>
          ) : null}
        </VStack>
        {unread ? (
          <View
            style={[staticStyles.dot, dotColor]}
            accessibilityLabel="Unread"
            accessibilityRole="image"
          />
        ) : null}
      </HStack>
    );

    if (!onPress) {
      return (
        <View ref={ref} style={style}>
          {content}
        </View>
      );
    }

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        accessibilityState={{ selected: unread }}
        onPress={handlePress}
        style={style}
      >
        {content}
      </Pressable>
    );
  },
);

NotificationItemImpl.displayName = 'NotificationItem';

export const NotificationItem = React.memo(NotificationItemImpl);
