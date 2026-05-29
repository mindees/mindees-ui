import { Button, Caption, HStack, Text, useTokens, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface PWAInstallPromptProps {
  /** Fired when the user taps install. */
  readonly onInstall: () => void;
  /** Fired when the user dismisses. Dismiss control hidden when absent. */
  readonly onDismiss?: () => void;
  /** Optional leading icon / app glyph node. */
  readonly icon?: React.ReactNode;
  /** Headline. Defaults to "Install this app". */
  readonly title?: string;
  /** Supporting copy. */
  readonly description?: string;
  /** Install button label. Defaults to "Install". */
  readonly installLabel?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_TITLE = 'Install this app';
const DEFAULT_DESCRIPTION = 'Add it to your home screen for a faster, full-screen experience.';

const staticStyles = StyleSheet.create({
  body: { flex: 1, minWidth: 0 },
  actions: { flexShrink: 0 },
});

const PWAInstallPromptImpl = React.forwardRef<View, PWAInstallPromptProps>(
  function PWAInstallPrompt(props, ref) {
    const {
      onInstall,
      onDismiss,
      icon,
      title = DEFAULT_TITLE,
      description = DEFAULT_DESCRIPTION,
      installLabel = 'Install',
      style,
    } = props;
    const tokens = useTokens();

    const wrapStyle = React.useMemo<ViewStyle>(
      () => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: tokens.space.sm,
        width: '100%',
        padding: tokens.space.md,
        backgroundColor: tokens.colors.background.elevated,
        borderWidth: 1,
        borderColor: tokens.colors.border.default,
        borderRadius: tokens.radii.lg,
      }),
      [tokens],
    );

    return (
      <View
        ref={ref}
        accessibilityRole="none"
        accessibilityLabel={title}
        style={[wrapStyle, style]}
      >
        {icon ? <View accessibilityRole="none">{icon}</View> : null}
        <VStack gap="3xs" style={staticStyles.body}>
          <Text weight="semibold" tone="primary" numberOfLines={1}>
            {title}
          </Text>
          {description ? (
            <Caption tone="muted" numberOfLines={2}>
              {description}
            </Caption>
          ) : null}
        </VStack>
        <HStack gap="xs" align="center" style={staticStyles.actions}>
          {onDismiss ? (
            <Button size="sm" variant="ghost" tone="neutral" onPress={onDismiss}>
              Not now
            </Button>
          ) : null}
          <Button size="sm" variant="solid" tone="primary" onPress={onInstall}>
            {installLabel}
          </Button>
        </HStack>
      </View>
    );
  },
);

PWAInstallPromptImpl.displayName = 'PWAInstallPrompt';

export const PWAInstallPrompt = React.memo(PWAInstallPromptImpl);
