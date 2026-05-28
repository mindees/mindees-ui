import { Avatar, Divider, HStack, Rating, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { FlatList, type ListRenderItemInfo, type StyleProp, type ViewStyle } from 'react-native';

import { type Review } from './types';

export interface ReviewsListProps {
  /** Reviews to render. */
  readonly reviews: readonly Review[];
  /** Optional heading rendered above the list. */
  readonly title?: string;
  /** Rendered when `reviews` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the FlatList container. */
  readonly style?: StyleProp<ViewStyle>;
}

interface ReviewRowProps {
  readonly review: Review;
}

const ReviewRow = React.memo(function ReviewRow({ review }: ReviewRowProps) {
  return (
    <VStack gap="2xs">
      <HStack gap="sm" align="center">
        <Avatar src={review.avatar} name={review.author} size="sm" />
        <VStack gap="none" style={GROW_STYLE}>
          <Text variant="bodySm" weight="semibold">
            {review.author}
          </Text>
          <Rating value={Math.round(review.rating)} readOnly size={12} />
        </VStack>
        {review.date ? (
          <Text variant="caption" tone="muted">
            {review.date}
          </Text>
        ) : null}
      </HStack>
      {review.text ? (
        <Text variant="bodySm" tone="secondary">
          {review.text}
        </Text>
      ) : null}
    </VStack>
  );
});

const GROW_STYLE: ViewStyle = { flex: 1 };

function keyExtractor(item: Review, index: number): string {
  return item.id ?? `${item.author}-${index}`;
}

function renderItem({ item }: ListRenderItemInfo<Review>): React.ReactElement {
  return <ReviewRow review={item} />;
}

function renderSeparator(): React.ReactElement {
  return <Divider inset={0} />;
}

const ReviewsListImpl = React.forwardRef<FlatList<Review>, ReviewsListProps>(
  function ReviewsList(props, ref) {
    const { reviews, title, ListEmptyComponent, scrollEnabled = true, style } = props;

    const header = React.useMemo(
      () =>
        title ? (
          <Text variant="h5" weight="semibold" accessibilityRole="header">
            {title}
          </Text>
        ) : null,
      [title],
    );

    return (
      <FlatList
        ref={ref}
        data={reviews}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        ListHeaderComponent={header}
        ListEmptyComponent={ListEmptyComponent}
        scrollEnabled={scrollEnabled}
        contentContainerStyle={CONTENT_STYLE}
        showsVerticalScrollIndicator={false}
        style={style}
      />
    );
  },
);

const CONTENT_STYLE: ViewStyle = { gap: 12 };

ReviewsListImpl.displayName = 'ReviewsList';

export const ReviewsList = React.memo(ReviewsListImpl);
