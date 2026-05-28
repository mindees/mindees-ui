import * as React from 'react';
import { ScrollView, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface TableColumn {
  readonly key: string;
  readonly title: React.ReactNode;
  /** Fixed column width in px. Defaults to 120. */
  readonly width?: number;
}

export interface TableProps extends Omit<ViewProps, 'style'> {
  readonly columns: readonly TableColumn[];
  readonly data: readonly Record<string, React.ReactNode>[];
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_WIDTH = 120;

const ROW_STYLE: ViewStyle = { flexDirection: 'row' };
const CELL_BASE: ViewStyle = { justifyContent: 'center' };

const TableImpl = React.forwardRef<ScrollView, TableProps>(function Table(props, ref) {
  const { columns, data, style, ...rest } = props;
  const tokens = useTokens();

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
  const bodyRowStyle: ViewStyle = {
    ...ROW_STYLE,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.subtle,
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
          {columns.map((col) => (
            <View
              key={col.key}
              accessibilityRole="header"
              style={[CELL_BASE, cellPadding, { width: col.width ?? DEFAULT_WIDTH }]}
            >
              {typeof col.title === 'string' ? (
                <Text variant="label" weight="semibold" tone="secondary">
                  {col.title}
                </Text>
              ) : (
                col.title
              )}
            </View>
          ))}
        </View>
        {data.map((row, rowIndex) => (
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
        ))}
      </View>
    </ScrollView>
  );
});

TableImpl.displayName = 'Table';

export const Table = tagComponent(TableImpl, 'Table');
