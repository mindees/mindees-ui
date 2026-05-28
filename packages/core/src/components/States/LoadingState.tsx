import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Spinner } from '../Display/Spinner';
import { Text } from '../Text/Text';

export interface LoadingStateProps extends Omit<ViewProps, 'style'> {
  /** Optional label shown under the spinner. Falls back to a default. */
  readonly label?: string;
  /** Spinner size. Defaults to `lg` so the busy state reads as a full-screen wait. */
  readonly size?: 'sm' | 'md' | 'lg';
  readonly style?: StyleProp<ViewStyle>;
}

const LoadingStateImpl = React.forwardRef<View, LoadingStateProps>(
  function LoadingState(props, ref) {
    const { label = 'Loading…', size = 'lg', style, ...rest } = props;
    const tokens = useTokens();
    return (
      <View
        ref={ref}
        accessibilityRole="progressbar"
        accessibilityLabel={label}
        accessibilityState={EMPTY_BUSY}
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            gap: tokens.space.sm,
            padding: tokens.space.xl,
          },
          style,
        ]}
        {...rest}
      >
        <Spinner size={size} />
        {label ? (
          <Text variant="body" tone="muted" align="center">
            {label}
          </Text>
        ) : null}
      </View>
    );
  },
);

// Hoisted so the accessibilityState object is not reallocated per render.
const EMPTY_BUSY = { busy: true } as const;

LoadingStateImpl.displayName = 'LoadingState';

const LoadingStateMemo = React.memo(LoadingStateImpl);
LoadingStateMemo.displayName = 'LoadingState';

/** Centered busy indicator with an optional label. */
export const LoadingState = tagComponent(LoadingStateMemo, 'LoadingState');
