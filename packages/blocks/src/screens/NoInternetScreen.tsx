import { Box, OfflineState, ScreenWrapper } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface NoInternetScreenProps {
  /** Heading copy. Defaults to the OfflineState default ("You're offline"). */
  readonly title?: string;
  /** Supporting copy under the title. */
  readonly description?: string;
  /** Illustration or icon rendered above the title. */
  readonly illustration?: React.ReactNode;
  /** Label for the retry button. Defaults to "Retry". */
  readonly retryLabel?: string;
  /** Called when the retry button is pressed. The button is omitted when absent. */
  readonly onRetry?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  state: { flex: 1 },
});

const NoInternetScreenImpl = React.forwardRef<View, NoInternetScreenProps>(
  function NoInternetScreen(props, ref) {
    const {
      title,
      description = 'Check your connection and try again.',
      illustration,
      retryLabel,
      onRetry,
      style,
    } = props;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper>
          <OfflineState
            style={staticStyles.state}
            title={title}
            description={description}
            icon={illustration}
            onRetry={onRetry}
            retryLabel={retryLabel}
          />
        </ScreenWrapper>
      </Box>
    );
  },
);

NoInternetScreenImpl.displayName = 'NoInternetScreen';

/** "No connection" screen: offline-state preset + optional retry action. */
export const NoInternetScreen = React.memo(NoInternetScreenImpl);
