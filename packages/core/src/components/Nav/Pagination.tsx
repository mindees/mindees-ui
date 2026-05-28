import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface PaginationProps extends ViewProps {
  readonly total: number;
  readonly page: number;
  readonly onPageChange: (next: number) => void;
  /** Pages to show on each side of the current page. Defaults to 1. */
  readonly siblingCount?: number;
  readonly style?: StyleProp<ViewStyle>;
}

function buildRange(total: number, page: number, sibling: number): readonly (number | '...')[] {
  if (total <= 7 + sibling * 2) return Array.from({ length: total }, (_, i) => i + 1);
  const start = Math.max(2, page - sibling);
  const end = Math.min(total - 1, page + sibling);
  const out: (number | '...')[] = [1];
  if (start > 2) out.push('...');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('...');
  out.push(total);
  return out;
}

const PaginationImpl = React.forwardRef<View, PaginationProps>(function Pagination(props, ref) {
  const { total, page, onPageChange, siblingCount = 1, style, ...rest } = props;
  const tokens = useTokens();
  const pages = buildRange(total, page, siblingCount);

  const dot: ViewStyle = {
    minWidth: 36,
    minHeight: 36,
    paddingHorizontal: tokens.space['2xs'],
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: tokens.radii.md,
  };

  const containerStyle: ViewStyle = { flexDirection: 'row', gap: tokens.space['2xs'] };

  return (
    <View ref={ref} accessibilityRole="none" style={[containerStyle, style]} {...rest}>
      {pages.map((p, i) => {
        if (p === '...') {
          return (
            <View key={`gap-${i}`} style={dot}>
              <Text tone="muted">…</Text>
            </View>
          );
        }
        const active = p === page;
        return (
          <Pressable
            key={p}
            onPress={() => onPageChange(p)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Page ${p}`}
            style={[
              dot,
              {
                backgroundColor: active
                  ? tokens.colors.action.primary
                  : tokens.colors.background.subtle,
              },
            ]}
          >
            <Text tone={active ? 'onAccent' : 'primary'} weight="semibold">
              {p}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

PaginationImpl.displayName = 'Pagination';

export const Pagination = tagComponent(PaginationImpl, 'Pagination');
