import * as React from 'react';
import {
  RefreshControl,
  ScrollView,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface PullToRefreshProps extends Omit<ScrollViewProps, 'refreshControl' | 'style'> {
  readonly refreshing: boolean;
  readonly onRefresh: () => void;
  /** Override the spinner tint. Defaults to `theme.colors.action.primary`. */
  readonly tintColor?: string;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

const PullToRefreshImpl = React.forwardRef<ScrollView, PullToRefreshProps>(
  function PullToRefresh(props, ref) {
    const { refreshing, onRefresh, tintColor, children, style, ...rest } = props;
    const tokens = useTokens();
    const tint = tintColor ?? tokens.colors.action.primary;

    // `colors` (Android) and `tintColor` (iOS) cover both platforms.
    const androidColors = React.useMemo(() => [tint], [tint]);

    const control = (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={tint}
        colors={androidColors}
        progressBackgroundColor={tokens.colors.background.elevated}
      />
    );

    return (
      <ScrollView
        ref={ref}
        refreshControl={control}
        style={style}
        accessibilityRole="none"
        {...rest}
      >
        {children}
      </ScrollView>
    );
  },
);

PullToRefreshImpl.displayName = 'PullToRefresh';

export const PullToRefresh = tagComponent(React.memo(PullToRefreshImpl), 'PullToRefresh');
