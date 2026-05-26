import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface TimelineItem {
  readonly title: React.ReactNode;
  readonly time?: string;
  readonly description?: React.ReactNode;
  readonly tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'primary';
}

export interface TimelineProps {
  readonly items: readonly TimelineItem[];
}

const TimelineImpl = React.forwardRef<View, TimelineProps>(function Timeline(props, ref) {
  const { items } = props;
  const tokens = useTokens();
  const lastIndex = items.length - 1;

  return (
    <View ref={ref} accessibilityRole="list">
      {items.map((item, i) => {
        const dotColor =
          item.tone === 'success'
            ? tokens.colors.status.success
            : item.tone === 'warning'
              ? tokens.colors.status.warning
              : item.tone === 'danger'
                ? tokens.colors.status.danger
                : item.tone === 'primary'
                  ? tokens.colors.action.primary
                  : tokens.colors.border.strong;
        const rowStyle: ViewStyle = { flexDirection: 'row', gap: tokens.space.sm };
        const railColumnStyle: ViewStyle = { alignItems: 'center', width: 16 };
        return (
          <View
            key={i}
            accessibilityRole="none"
            style={[rowStyle, { paddingBottom: i === lastIndex ? 0 : tokens.space.sm }]}
          >
            <View style={railColumnStyle}>
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: dotColor,
                  marginTop: 6,
                }}
              />
              {i !== lastIndex ? (
                <View
                  style={{
                    flex: 1,
                    width: 1,
                    backgroundColor: tokens.colors.border.subtle,
                    marginTop: 4,
                  }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1, gap: tokens.space['3xs'] }}>
              {typeof item.title === 'string' ? (
                <Text weight="medium">{item.title}</Text>
              ) : (
                item.title
              )}
              {item.time ? (
                <Text variant="caption" tone="muted">
                  {item.time}
                </Text>
              ) : null}
              {item.description ? (
                typeof item.description === 'string' ? (
                  <Text variant="caption" tone="secondary">
                    {item.description}
                  </Text>
                ) : (
                  item.description
                )
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
});

TimelineImpl.displayName = 'Timeline';

export const Timeline = tagComponent(TimelineImpl, 'Timeline');
