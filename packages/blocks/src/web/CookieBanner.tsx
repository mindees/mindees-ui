import { Button, HStack, Text, useTokens, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface CookieBannerProps {
  /** Fired when the user accepts cookies. */
  readonly onAccept: () => void;
  /** Fired when the user declines. Decline button hidden when absent. */
  readonly onDecline?: () => void;
  /** Fired when the user opens preferences. "Manage" button hidden when absent. */
  readonly onManage?: () => void;
  /** Consent copy. Defaults to a generic notice. */
  readonly message?: string;
  /** Accept button label. Defaults to "Accept all". */
  readonly acceptLabel?: string;
  /** Decline button label. Defaults to "Decline". */
  readonly declineLabel?: string;
  /** Manage button label. Defaults to "Manage". */
  readonly manageLabel?: string;
  /** Style spread onto the root banner. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_MESSAGE =
  'We use cookies to improve your experience, analyze traffic, and personalize content.';

const staticStyles = StyleSheet.create({
  actions: { flexWrap: 'wrap' },
  message: { flexShrink: 1 },
});

const CookieBannerImpl = React.forwardRef<View, CookieBannerProps>(
  function CookieBanner(props, ref) {
    const {
      onAccept,
      onDecline,
      onManage,
      message = DEFAULT_MESSAGE,
      acceptLabel = 'Accept all',
      declineLabel = 'Decline',
      manageLabel = 'Manage',
      style,
    } = props;
    const tokens = useTokens();

    const wrapStyle = React.useMemo<ViewStyle>(
      () => ({
        width: '100%',
        padding: tokens.space.md,
        backgroundColor: tokens.colors.background.elevated,
        borderTopWidth: 1,
        borderTopColor: tokens.colors.border.default,
      }),
      [tokens],
    );

    return (
      <View
        ref={ref}
        accessibilityRole="alert"
        accessibilityLabel="Cookie consent"
        style={[wrapStyle, style]}
      >
        <VStack gap="sm">
          <Text tone="secondary" style={staticStyles.message}>
            {message}
          </Text>
          <HStack gap="xs" justify="end" align="center" style={staticStyles.actions}>
            {onManage ? (
              <Button variant="ghost" tone="neutral" onPress={onManage}>
                {manageLabel}
              </Button>
            ) : null}
            {onDecline ? (
              <Button variant="outline" tone="neutral" onPress={onDecline}>
                {declineLabel}
              </Button>
            ) : null}
            <Button variant="solid" tone="primary" onPress={onAccept}>
              {acceptLabel}
            </Button>
          </HStack>
        </VStack>
      </View>
    );
  },
);

CookieBannerImpl.displayName = 'CookieBanner';

export const CookieBanner = React.memo(CookieBannerImpl);
