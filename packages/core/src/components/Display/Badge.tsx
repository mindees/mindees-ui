import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type BadgeTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
export type BadgeVariant = 'solid' | 'subtle' | 'outline';

export interface BadgeProps {
  readonly tone?: BadgeTone;
  readonly variant?: BadgeVariant;
  readonly size?: 'sm' | 'md';
  readonly children?: React.ReactNode;
}

function toneColors(
  tokens: ReturnType<typeof useTokens>,
  tone: BadgeTone,
  variant: BadgeVariant,
): { readonly bg: string; readonly text: string; readonly border: string } {
  const map = {
    neutral: {
      strong: tokens.colors.action.secondary,
      subtle: tokens.colors.background.subtle,
      text: tokens.colors.text.primary,
    },
    primary: {
      strong: tokens.colors.action.primary,
      subtle: tokens.colors.status.infoSubtle,
      text: tokens.colors.text.link,
    },
    success: {
      strong: tokens.colors.status.success,
      subtle: tokens.colors.status.successSubtle,
      text: tokens.colors.status.success,
    },
    warning: {
      strong: tokens.colors.status.warning,
      subtle: tokens.colors.status.warningSubtle,
      text: tokens.colors.status.warning,
    },
    danger: {
      strong: tokens.colors.status.danger,
      subtle: tokens.colors.status.dangerSubtle,
      text: tokens.colors.status.danger,
    },
    info: {
      strong: tokens.colors.status.info,
      subtle: tokens.colors.status.infoSubtle,
      text: tokens.colors.status.info,
    },
  }[tone];
  if (variant === 'solid')
    return { bg: map.strong, text: tokens.colors.text.onAccent, border: map.strong };
  if (variant === 'outline') return { bg: 'transparent', text: map.text, border: map.strong };
  return { bg: map.subtle, text: map.text, border: map.subtle };
}

const BadgeImpl = React.forwardRef<View, BadgeProps>(function Badge(props, ref) {
  const { tone = 'neutral', variant = 'subtle', size = 'sm', children } = props;
  const tokens = useTokens();
  const c = toneColors(tokens, tone, variant);
  const style: ViewStyle = {
    paddingHorizontal: size === 'sm' ? tokens.space['2xs'] : tokens.space.xs,
    paddingVertical: 1,
    backgroundColor: c.bg,
    borderColor: c.border,
    borderWidth: variant === 'outline' ? 1 : 0,
    borderRadius: tokens.radii.pill,
    alignSelf: 'flex-start',
  };
  return (
    <View ref={ref} accessibilityRole="text" style={style}>
      <Text
        variant={size === 'sm' ? 'caption' : 'label'}
        weight="semibold"
        style={{ color: c.text }}
      >
        {children}
      </Text>
    </View>
  );
});

BadgeImpl.displayName = 'Badge';

export const Badge = tagComponent(BadgeImpl, 'Badge');
