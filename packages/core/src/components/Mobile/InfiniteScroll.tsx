import * as React from 'react';
import {
  FlatList,
  type FlatListProps,
  type ListRenderItem,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Spinner } from '../Display/Spinner';

export interface InfiniteScrollProps<ItemT> extends Omit<
  FlatListProps<ItemT>,
  'data' | 'renderItem' | 'onEndReached' | 'ListFooterComponent' | 'style'
> {
  readonly data: readonly ItemT[];
  readonly renderItem: ListRenderItem<ItemT>;
  /** Called when the list nears its end and is not already loading. */
  readonly onLoadMore: () => void;
  /** Whether a page is currently being fetched. Controls the footer spinner. */
  readonly loading?: boolean;
  /** Distance from the end (0-1) that triggers `onLoadMore`. Defaults to 0.5. */
  readonly onEndReachedThreshold?: number;
  readonly style?: StyleProp<ViewStyle>;
}

const FOOTER_STYLE: ViewStyle = { alignItems: 'center', justifyContent: 'center' };

function InfiniteScrollInner<ItemT>(
  props: InfiniteScrollProps<ItemT>,
  ref: React.Ref<FlatList<ItemT>>,
): React.ReactElement {
  const {
    data,
    renderItem,
    onLoadMore,
    loading = false,
    onEndReachedThreshold = 0.5,
    style,
    ...rest
  } = props;
  const tokens = useTokens();

  // Guard against the burst of onEndReached calls FlatList fires while the
  // user keeps scrolling: ignore until the next content layout settles.
  const canLoad = React.useRef(true);

  const handleEndReached = React.useCallback(() => {
    if (!canLoad.current || loading) return;
    canLoad.current = false;
    onLoadMore();
  }, [loading, onLoadMore]);

  const handleContentSizeChange = React.useCallback(() => {
    canLoad.current = true;
  }, []);

  const footer = loading ? (
    <View style={[FOOTER_STYLE, { paddingVertical: tokens.space.md }]}>
      <Spinner size="md" />
    </View>
  ) : null;

  return (
    <FlatList
      ref={ref}
      data={data as ItemT[]}
      renderItem={renderItem}
      onEndReached={handleEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      onContentSizeChange={handleContentSizeChange}
      ListFooterComponent={footer}
      accessibilityRole="list"
      style={style}
      {...rest}
    />
  );
}

// `forwardRef` erases the generic, so re-assert the generic call signature on
// the memoised result. The cast is internal only — consumers keep `ItemT`.
const InfiniteScrollForwarded = React.forwardRef(InfiniteScrollInner);
InfiniteScrollForwarded.displayName = 'InfiniteScroll';

const InfiniteScrollMemo = tagComponent(React.memo(InfiniteScrollForwarded), 'InfiniteScroll');

export const InfiniteScroll = InfiniteScrollMemo as unknown as (<ItemT>(
  props: InfiniteScrollProps<ItemT> & { readonly ref?: React.Ref<FlatList<ItemT>> },
) => React.ReactElement) &
  typeof InfiniteScrollMemo;
