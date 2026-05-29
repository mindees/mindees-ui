import { Avatar, Caption, HStack, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  type ViewStyle,
} from 'react-native';

import { LikeButton } from './LikeButton';

/** A single comment. */
export interface Comment {
  /** Stable identity. */
  readonly id: string;
  /** Author display name. */
  readonly author: string;
  /** Comment body. */
  readonly text: string;
  /** Pre-formatted relative time, e.g. "2h". */
  readonly time?: string;
  /** Author avatar URL. Falls back to initials. */
  readonly avatar?: string;
  /** Whether the viewer liked this comment. */
  readonly liked?: boolean;
  /** Like count. */
  readonly likeCount?: number;
}

export interface CommentsListProps {
  /** Comments to render. */
  readonly comments: readonly Comment[];
  /** Called with the comment id and next liked state when its like is toggled. */
  readonly onLike?: (id: string, next: boolean) => void;
  /** Rendered when `comments` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the FlatList container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
  like: { alignSelf: 'flex-start' },
});

interface CommentRowProps {
  readonly comment: Comment;
  readonly onLike?: (id: string, next: boolean) => void;
}

const CommentRow = React.memo(function CommentRow({ comment, onLike }: CommentRowProps) {
  const { id, author, text, time, avatar, liked, likeCount } = comment;

  const handleLike = React.useCallback(
    (next: boolean) => {
      onLike?.(id, next);
    },
    [onLike, id],
  );

  return (
    <HStack gap="sm" align="start">
      <Avatar src={avatar} name={author} size="sm" />
      <VStack gap="3xs" style={staticStyles.grow}>
        <HStack gap="xs" align="center">
          <Text variant="bodySm" weight="semibold" numberOfLines={1}>
            {author}
          </Text>
          {time ? <Caption tone="muted">{time}</Caption> : null}
        </HStack>
        <Text variant="bodySm" tone="secondary">
          {text}
        </Text>
        <LikeButton
          liked={liked}
          count={likeCount}
          onToggle={onLike ? handleLike : undefined}
          style={staticStyles.like}
        />
      </VStack>
    </HStack>
  );
});

function keyExtractor(item: Comment): string {
  return item.id;
}

const CommentsListImpl = React.forwardRef<FlatList<Comment>, CommentsListProps>(
  function CommentsList(props, ref) {
    const { comments, onLike, ListEmptyComponent, scrollEnabled = true, style } = props;

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<Comment>) => <CommentRow comment={item} onLike={onLike} />,
      [onLike],
    );

    return (
      <FlatList
        ref={ref}
        data={comments}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={CONTENT_STYLE}
        style={style}
      />
    );
  },
);

const CONTENT_STYLE: ViewStyle = { gap: 16 };

CommentsListImpl.displayName = 'CommentsList';

export const CommentsList = React.memo(CommentsListImpl);
