import * as React from 'react';
import {
  FlatList,
  View,
  type ListRenderItem,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

import { Avatar } from './Avatar';

export interface FeedItem {
  readonly id?: string;
  readonly title?: React.ReactNode;
  readonly timestamp?: string;
  readonly body?: React.ReactNode;
  /** Avatar image URL for the default item layout. */
  readonly avatar?: string;
  /** Name used to derive avatar initials when no image is supplied. */
  readonly name?: string;
}

export interface FeedProps extends Omit<ViewProps, 'style'> {
  readonly items: readonly FeedItem[];
  /** Override the default item layout. */
  readonly renderItem?: (item: FeedItem, index: number) => React.ReactElement | null;
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_STYLE: ViewStyle = { flexDirection: 'row' };
const HEADER_STYLE: ViewStyle = { flexDirection: 'row', alignItems: 'center' };
const BODY_COLUMN_STYLE: ViewStyle = { flex: 1 };

const DefaultFeedItem = React.memo(function DefaultFeedItem(props: { readonly item: FeedItem }) {
  const { item } = props;
  const tokens = useTokens();
  return (
    <View accessibilityRole="none" style={[ROW_STYLE, { gap: tokens.space.sm }]}>
      <Avatar src={item.avatar} name={item.name} size="sm" />
      <View style={[BODY_COLUMN_STYLE, { gap: tokens.space['3xs'] }]}>
        <View style={[HEADER_STYLE, { gap: tokens.space.xs }]}>
          {item.title != null ? (
            typeof item.title === 'string' ? (
              <Text weight="semibold">{item.title}</Text>
            ) : (
              item.title
            )
          ) : null}
          {item.timestamp ? (
            <Text variant="caption" tone="muted">
              {item.timestamp}
            </Text>
          ) : null}
        </View>
        {item.body != null ? (
          typeof item.body === 'string' ? (
            <Text tone="secondary">{item.body}</Text>
          ) : (
            item.body
          )
        ) : null}
      </View>
    </View>
  );
});

const FeedImpl = React.forwardRef<View, FeedProps>(function Feed(props, ref) {
  const { items, renderItem, style, ...rest } = props;
  const tokens = useTokens();

  const keyExtractor = React.useCallback(
    (item: FeedItem, index: number) => item.id ?? String(index),
    [],
  );

  const internalRenderItem = React.useCallback<ListRenderItem<FeedItem>>(
    ({ item, index }) => {
      if (renderItem) return renderItem(item, index);
      return <DefaultFeedItem item={item} />;
    },
    [renderItem],
  );

  const separatorStyle: ViewStyle = { height: tokens.space.md };
  const ItemSeparator = React.useCallback(
    () => <View style={separatorStyle} />,
    // separatorStyle depends only on tokens.space.md
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [tokens.space.md],
  );

  return (
    <FlatList
      ref={ref as React.Ref<FlatList<FeedItem>>}
      data={items as FeedItem[]}
      renderItem={internalRenderItem}
      keyExtractor={keyExtractor}
      ItemSeparatorComponent={ItemSeparator}
      accessibilityRole="list"
      style={style}
      {...rest}
    />
  );
});

FeedImpl.displayName = 'Feed';

export const Feed = tagComponent(FeedImpl, 'Feed');
