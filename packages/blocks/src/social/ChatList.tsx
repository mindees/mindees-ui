import { Avatar, Badge, Caption, Divider, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  Pressable,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

/** A single conversation row in the ChatList. */
export interface Conversation {
  /** Stable identity. */
  readonly id: string;
  /** Display name of the person/group. */
  readonly name: string;
  /** Preview of the most recent message. */
  readonly lastMessage?: string;
  /** Pre-formatted timestamp, e.g. "09:41". */
  readonly time?: string;
  /** Avatar image URL. Falls back to initials. */
  readonly avatar?: string;
  /** Number of unread messages. Shows a badge when > 0. */
  readonly unreadCount?: number;
}

export interface ChatListProps {
  /** Conversations to render. */
  readonly conversations: readonly Conversation[];
  /** Called with the conversation id when a row is pressed. */
  readonly onPressConversation?: (id: string) => void;
  /** Rendered when `conversations` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the FlatList container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  grow: { flex: 1 },
  meta: { alignItems: 'flex-end' },
});

interface ConversationRowProps {
  readonly conversation: Conversation;
  readonly onPress?: (id: string) => void;
}

const ConversationRow = React.memo(function ConversationRow({
  conversation,
  onPress,
}: ConversationRowProps) {
  const { id, name, lastMessage, time, avatar, unreadCount = 0 } = conversation;
  const hasUnread = unreadCount > 0;

  const handlePress = React.useCallback(() => {
    onPress?.(id);
  }, [onPress, id]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={hasUnread ? `${name}, ${unreadCount} unread` : name}
      disabled={!onPress}
      onPress={handlePress}
      style={staticStyles.row}
    >
      <Avatar src={avatar} name={name} size="lg" />
      <VStack gap="3xs" style={staticStyles.grow}>
        <Text variant="body" weight="semibold" numberOfLines={1}>
          {name}
        </Text>
        {lastMessage ? (
          <Caption tone={hasUnread ? 'secondary' : 'muted'} numberOfLines={1}>
            {lastMessage}
          </Caption>
        ) : null}
      </VStack>
      <VStack gap="3xs" align="end" style={staticStyles.meta}>
        {time ? <Caption tone="muted">{time}</Caption> : null}
        {hasUnread ? (
          <Badge tone="primary" variant="solid">
            {unreadCount}
          </Badge>
        ) : null}
      </VStack>
    </Pressable>
  );
});

function keyExtractor(item: Conversation): string {
  return item.id;
}

const ChatListImpl = React.forwardRef<FlatList<Conversation>, ChatListProps>(
  function ChatList(props, ref) {
    const {
      conversations,
      onPressConversation,
      ListEmptyComponent,
      scrollEnabled = true,
      style,
    } = props;

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<Conversation>) => (
        <ConversationRow conversation={item} onPress={onPressConversation} />
      ),
      [onPressConversation],
    );

    return (
      <FlatList
        ref={ref}
        data={conversations}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        style={style}
      />
    );
  },
);

function renderSeparator(): React.ReactElement {
  return <Divider inset={0} />;
}

ChatListImpl.displayName = 'ChatList';

export const ChatList = React.memo(ChatListImpl);
