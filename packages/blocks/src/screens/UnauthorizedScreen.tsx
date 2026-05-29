import { Box, Button, EmptyState, ScreenWrapper } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface UnauthorizedScreenProps {
  /** Heading copy. Defaults to "Access denied". */
  readonly title?: string;
  /** Supporting copy under the title. */
  readonly description?: string;
  /** Illustration or icon rendered above the title. */
  readonly illustration?: React.ReactNode;
  /** Label for the sign-in button. Defaults to "Sign in". */
  readonly signInLabel?: string;
  /** Called when the sign-in button is pressed. The button is omitted when absent. */
  readonly onSignIn?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  state: { flex: 1 },
});

const UnauthorizedScreenImpl = React.forwardRef<View, UnauthorizedScreenProps>(
  function UnauthorizedScreen(props, ref) {
    const {
      title = 'Access denied',
      description = "You don't have permission to view this page. Sign in to continue.",
      illustration,
      signInLabel = 'Sign in',
      onSignIn,
      style,
    } = props;

    const action = onSignIn ? (
      <Button tone="primary" onPress={onSignIn}>
        {signInLabel}
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

UnauthorizedScreenImpl.displayName = 'UnauthorizedScreen';

/** 403 screen: empty-state preset + optional "sign in" action. */
export const UnauthorizedScreen = React.memo(UnauthorizedScreenImpl);
