import { space } from '@mindees/tokens';
import { Box, ScreenWrapper, VStack } from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { AnalyticsCards, type AnalyticsMetric } from '../dashboard';

export interface DashboardScreenProps {
  /** KPI metrics rendered as a responsive grid of cards at the top. */
  readonly metrics?: readonly AnalyticsMetric[];
  /** Called with the metric id when a KPI card is pressed. */
  readonly onPressMetric?: (id: string) => void;
  /** Sticky header rendered above the scrollable content (e.g. a TopBar). */
  readonly header?: React.ReactNode;
  /** Additional dashboard content rendered below the metrics. */
  readonly children?: React.ReactNode;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, padding: space.md },
});

const DashboardScreenImpl = React.forwardRef<View, DashboardScreenProps>(
  function DashboardScreen(props, ref) {
    const { metrics, onPressMetric, header, children, style } = props;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          {header}
          <ScrollView contentContainerStyle={staticStyles.content}>
            <VStack gap="lg">
              {metrics && metrics.length > 0 ? (
                <AnalyticsCards metrics={metrics} onPressMetric={onPressMetric} />
              ) : null}
              {children}
            </VStack>
          </ScrollView>
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

DashboardScreenImpl.displayName = 'DashboardScreen';

/** Admin dashboard: KPI metric grid + scrollable content sections. */
export const DashboardScreen = React.memo(DashboardScreenImpl);
