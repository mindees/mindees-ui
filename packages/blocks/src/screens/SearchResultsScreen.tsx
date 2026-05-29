import { space } from '@mindees/tokens';
import { Box, EmptyState, SearchInput, ScreenWrapper } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

export interface SearchResult {
  /** Stable identity for list rendering. */
  readonly id: string;
}

export interface SearchResultsScreenProps<T extends SearchResult = SearchResult> {
  /** Current search query (controlled). */
  readonly query: string;
  /** Results to render for the current query. */
  readonly results: readonly T[];
  /** Called when the query text changes. */
  readonly onChangeQuery?: (next: string) => void;
  /** Placeholder shown in the search field. Defaults to "Search…". */
  readonly placeholder?: string;
  /** Renders a single result row. */
  readonly renderResult?: (item: T, index: number) => React.ReactElement | null;
  /** Title shown in the empty state. Defaults to "No results". */
  readonly emptyTitle?: string;
  /** Description shown in the empty state. */
  readonly emptyDescription?: string;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  header: { padding: space.md },
  list: { flexGrow: 1, paddingHorizontal: space.md },
  state: { flex: 1 },
});

function keyExtractor(item: SearchResult): string {
  return item.id;
}

function SearchResultsScreenInner<T extends SearchResult>(
  props: SearchResultsScreenProps<T>,
  ref: React.Ref<View>,
): React.ReactElement {
  const {
    query,
    results,
    onChangeQuery,
    placeholder,
    renderResult,
    emptyTitle = 'No results',
    emptyDescription = 'Try a different search term.',
    style,
  } = props;

  const renderItem = React.useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => renderResult?.(item, index) ?? null,
    [renderResult],
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
        <View style={staticStyles.header}>
          <SearchInput value={query} onChangeText={onChangeQuery} placeholder={placeholder} />
        </View>
        <FlatList
          data={results}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={staticStyles.list}
          ListEmptyComponent={empty}
          keyboardShouldPersistTaps="handled"
        />
      </ScreenWrapper>
    </Box>
  );
}

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

const SearchResultsScreenMemo = React.memo(React.forwardRef(SearchResultsScreenInner));

(SearchResultsScreenMemo as { displayName?: string }).displayName = 'SearchResultsScreen';

/** Search results: search header + results FlatList + empty state. */
export const SearchResultsScreen = SearchResultsScreenMemo as <
  T extends SearchResult = SearchResult,
>(
  props: SearchResultsScreenProps<T> & React.RefAttributes<View>,
) => React.ReactElement;
