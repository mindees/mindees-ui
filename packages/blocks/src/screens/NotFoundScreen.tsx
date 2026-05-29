import { Box, Button, EmptyState, ScreenWrapper } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface NotFoundScreenProps {
  /** Heading copy. Defaults to "Page not found". */
  readonly title?: string;
  /** Supporting copy under the title. */
  readonly description?: string;
  /** Illustration or icon rendered above the title. */
  readonly illustration?: React.ReactNode;
  /** Label for the home button. Defaults to "Go home". */
  readonly homeLabel?: string;
  /** Called when the home button is pressed. The button is omitted when absent. */
  readonly onGoHome?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  state: { flex: 1 },
});

const NotFoundScreenImpl = React.forwardRef<View, NotFoundScreenProps>(
  function NotFoundScreen(props, ref) {
    const {
      title = 'Page not found',
      description = "The page you're looking for doesn't exist or has moved.",
      illustration,
      homeLabel = 'Go home',
      onGoHome,
      style,
    } = props;

    const action = onGoHome ? (
      <Button tone="primary" onPress={onGoHome}>
        {homeLabel}
      </Button>
    ) : undefined;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper>
          <EmptyState
            style={staticStyles.state}
            title={title}
            description={description}
            icon={illustration}
            action={action}
          />
        </ScreenWrapper>
      </Box>
    );
  },
);

NotFoundScreenImpl.displayName = 'NotFoundScreen';

/** 404 screen: empty-state preset + optional "go home" action. */
export const NotFoundScreen = React.memo(NotFoundScreenImpl);
