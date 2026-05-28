import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type BannerTone = 'info' | 'success' | 'warning' | 'danger';

export interface BannerAction {
  readonly label: string;
  readonly onPress: () => void;
}

export interface BannerProps extends Omit<ViewProps, 'style'> {
  readonly message: string;
  readonly tone?: BannerTone;
  /** Optional leading icon node rendered before the message. */
  readonly icon?: React.ReactNode;
  /** Optional trailing action (text button). */
  readonly action?: BannerAction;
  /** Show a dismiss control; fires `onDismiss`. */
  readonly onDismiss?: () => void;
  /** Style applied to the banner surface. */
  readonly style?: StyleProp<ViewStyle>;
}

interface BannerColors {
  readonly bg: string;
  readonly border: string;
}

function bannerColors(tokens: ReturnType<typeof useTokens>, tone: BannerTone): BannerColors {
  switch (tone) {
    case 'success':
      return { bg: tokens.colors.status.successSubtle, border: tokens.colors.status.success };
    case 'warning':
      return { bg: tokens.colors.status.warningSubtle, border: tokens.colors.status.warning };
    case 'danger':
      return { bg: tokens.colors.status.dangerSubtle, border: tokens.colors.status.danger };
    case 'info':
      return { bg: tokens.colors.status.infoSubtle, border: tokens.colors.status.info };
  }
}

const BannerImpl = React.forwardRef<View, BannerProps>(function Banner(props, ref) {
  const { message, tone = 'info', icon, action, onDismiss, style, ...rest } = props;
  const tokens = useTokens();
  const colors = bannerColors(tokens, tone);

  const wrap: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space.sm,
    width: '100%',
    backgroundColor: colors.bg,
    borderLeftWidth: 3,
    borderLeftColor: colors.border,
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.sm,
    minHeight: 48,
  };

  const actionStyle: ViewStyle = {
    paddingHorizontal: tokens.space.xs,
    paddingVertical: tokens.space['2xs'],
    minHeight: 44,
    justifyContent: 'center',
  };

  const dismissStyle: ViewStyle = {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <View
      ref={ref}
      style={[wrap, style]}
      accessibilityRole="alert"
      accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      {...rest}
    >
      {icon ? <View>{icon}</View> : null}
      <Text tone="primary" style={BANNER_MESSAGE_FLEX}>
        {message}
      </Text>
      {action ? (
        <Pressable
          onPress={action.onPress}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={actionStyle}
        >
          <Text tone="link" weight="semibold">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
      {onDismiss ? (
        <Pressable
          onPress={onDismiss}
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          style={dismissStyle}
        >
          <Text tone="secondary" weight="semibold">
            {DISMISS_GLYPH}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
});

// Hoisted: token-free and caller-independent.
const BANNER_MESSAGE_FLEX = { flexShrink: 1 } as const;
// Multiplication sign (U+00D7) — a typographic close glyph, not an emoji.
const DISMISS_GLYPH = '×';

BannerImpl.displayName = 'Banner';

export const Banner = tagComponent(React.memo(BannerImpl), 'Banner');
