import { ChevronDownIcon, ChevronUpIcon } from '@mindees/icons';
import * as React from 'react';
import { Pressable, ScrollView, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface DataGridColumn {
  readonly key: string;
  readonly title: React.ReactNode;
  /** Fixed column width in px. Defaults to 120. */
  readonly width?: number;
  /** When true, the header is tappable to sort by this column. */
  readonly sortable?: boolean;
}

export type DataGridCell = string | number | React.ReactNode;
export type DataGridRow = Record<string, DataGridCell>;
export type SortDirection = 'asc' | 'desc';

export interface DataGridProps extends Omit<
  React.ComponentPropsWithoutRef<typeof ScrollView>,
  'style' | 'children'
> {
  readonly columns: readonly DataGridColumn[];
  readonly data: readonly DataGridRow[];
  /** Enable alternating row backgrounds. Defaults to true. */
  readonly zebra?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_WIDTH = 120;

const ROW_STYLE: ViewStyle = { flexDirection: 'row' };
const CELL_BASE: ViewStyle = { justifyContent: 'center' };
const HEADER_PRESSABLE: ViewStyle = { flexDirection: 'row', alignItems: 'center' };

interface SortState {
  readonly key: string;
  readonly direction: SortDirection;
}

// Sort comparator that keeps non-primitive cells (custom nodes) stable by
// coercing them to empty strings — sorting is only meaningful for text/number.
function compareCells(a: DataGridCell, b: DataGridCell): number {
  const av = typeof a === 'string' || typeof a === 'number' ? a : '';
  const bv = typeof b === 'string' || typeof b === 'number' ? b : '';
  if (typeof av === 'number' && typeof bv === 'number') return av - bv;
  return String(av).localeCompare(String(bv));
}

const DataGridImpl = React.forwardRef<ScrollView, DataGridProps>(function DataGrid(props, ref) {
  const { columns, data, zebra = true, style, ...rest } = props;
  const tokens = useTokens();
  const [sort, setSort] = React.useState<SortState | undefined>(undefined);

  const toggleSort = React.useCallback((key: string) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return undefined;
    });
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sort) return data;
    const copy = data.slice();
    copy.sort((rowA, rowB) => {
      const result = compareCells(rowA[sort.key], rowB[sort.key]);
      return sort.direction === 'asc' ? result : -result;
    });
    return copy;
  }, [data, sort]);

  const cellPadding: ViewStyle = {
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.xs,
    minHeight: 40,
  };
  const headerRowStyle: ViewStyle = {
    ...ROW_STYLE,
    backgroundColor: tokens.colors.background.subtle,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.default,
  };

  return (
    <ScrollView
      ref={ref}
      horizontal
      showsHorizontalScrollIndicator
      accessibilityRole="none"
      style={style}
      {...rest}
    >
      <View accessibilityRole="none">
        <View accessibilityRole="none" style={headerRowStyle}>
          {columns.map((col) => {
            const isSorted = sort?.key === col.key;
            const cellStyle: ViewStyle = {
              ...CELL_BASE,
              ...cellPadding,
              width: col.width ?? DEFAULT_WIDTH,
            };
            const titleNode =
              typeof col.title === 'string' ? (
                <Text variant="label" weight="semibold" tone="secondary">
                  {col.title}
                </Text>
              ) : (
                col.title
              );
            if (!col.sortable) {
              return (
                <View key={col.key} accessibilityRole="header" style={cellStyle}>
                  {titleNode}
                </View>
              );
            }
            return (
              <Pressable
                key={col.key}
                accessibilityRole="header"
                accessibilityState={{ selected: isSorted }}
                accessibilityHint="Tap to sort by this column"
                onPress={() => toggleSort(col.key)}
                style={cellStyle}
              >
                <View style={HEADER_PRESSABLE}>
                  {titleNode}
                  {isSorted ? (
                    sort?.direction === 'asc' ? (
                      <ChevronUpIcon size={14} color={tokens.colors.text.secondary} />
                    ) : (
                      <ChevronDownIcon size={14} color={tokens.colors.text.secondary} />
                    )
                  ) : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        {sortedData.map((row, rowIndex) => {
          const striped = zebra && rowIndex % 2 === 1;
          const bodyRowStyle: ViewStyle = {
            ...ROW_STYLE,
            borderBottomWidth: 1,
            borderBottomColor: tokens.colors.border.subtle,
            backgroundColor: striped
              ? tokens.colors.background.subtle
              : tokens.colors.background.surface,
          };
          return (
            <View key={rowIndex} accessibilityRole="none" style={bodyRowStyle}>
              {columns.map((col) => {
                const cell = row[col.key];
                return (
                  <View
                    key={col.key}
                    accessibilityRole="none"
                    style={[CELL_BASE, cellPadding, { width: col.width ?? DEFAULT_WIDTH }]}
                  >
                    {typeof cell === 'string' || typeof cell === 'number' ? (
                      <Text tone="primary">{cell}</Text>
                    ) : (
                      cell
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
});

DataGridImpl.displayName = 'DataGrid';

export const DataGrid = tagComponent(DataGridImpl, 'DataGrid');
