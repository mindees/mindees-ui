import { KPICard, useResponsive } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

/** Direction of a metric's change, mapped to a tone in the KPI delta. */
export type MetricTrend = 'up' | 'down' | 'neutral';

/** A single key performance metric rendered as a KPI card. */
export interface AnalyticsMetric {
  /** Stable identity for list rendering. */
  readonly id: string;
  /** Short label, e.g. "Revenue". */
  readonly label: string;
  /** Pre-formatted value, e.g. "$12.4k". */
  readonly value: string;
  /** Optional pre-formatted change string, e.g. "+12%". */
  readonly delta?: string;
  /** Drives the delta color: up = success, down = danger. */
  readonly trend?: MetricTrend;
}

export interface AnalyticsCardsProps {
  /** Metrics to render as KPI cards. */
  readonly metrics: readonly AnalyticsMetric[];
  /**
   * Number of columns. Defaults to a responsive value (1 on narrow,
   * 2 on sm, 4 on lg+) when omitted.
   */
  readonly columns?: number;
  /** Called with the metric id when a card is pressed. */
  readonly onPressMetric?: (id: string) => void;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap' },
});

const GAP = 12;

const AnalyticsCardsImpl = React.forwardRef<View, AnalyticsCardsProps>(
  function AnalyticsCards(props, ref) {
    const { metrics, columns, onPressMetric, style } = props;
    const responsiveColumns = useResponsive({ xs: 1, sm: 2, lg: 4 }) ?? 1;
    const cols = columns ?? responsiveColumns;

    const cellStyle = React.useMemo<ViewStyle>(
      () => ({ width: `${100 / cols}%`, padding: GAP / 2 }),
      [cols],
    );

    return (
      <View ref={ref} accessibilityRole="none" style={[staticStyles.row, style]}>
        {metrics.map((metric) => (
          <View key={metric.id} style={cellStyle}>
            <MetricCell metric={metric} onPress={onPressMetric} />
          </View>
        ))}
      </View>
    );
  },
);

interface MetricCellProps {
  readonly metric: AnalyticsMetric;
  readonly onPress?: (id: string) => void;
}

const MetricCellImpl = React.forwardRef<View, MetricCellProps>(function MetricCell(props, ref) {
  const { metric, onPress } = props;
  const handlePress = React.useCallback(() => onPress?.(metric.id), [onPress, metric.id]);
  const delta = metric.delta
    ? { value: metric.delta, direction: metric.trend ?? 'neutral' }
    : undefined;
  return (
    <KPICard
      ref={ref}
      label={metric.label}
      value={metric.value}
      delta={delta}
      onPress={onPress ? handlePress : undefined}
    />
  );
});

MetricCellImpl.displayName = 'AnalyticsMetricCell';
const MetricCell = React.memo(MetricCellImpl);

AnalyticsCardsImpl.displayName = 'AnalyticsCards';

export const AnalyticsCards = React.memo(AnalyticsCardsImpl);
