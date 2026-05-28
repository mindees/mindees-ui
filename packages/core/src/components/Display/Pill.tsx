import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type PillTone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export interface PillProps extends Omit<ViewProps, 'style'> {
  readonly tone?: PillTone;
  /** Optional leading node (typically a small icon or dot). */
  readonly leading?: React.ReactNode;
  readonly onPress?: () => void;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

function pillColors(
  tokens: ReturnType<typeof useTokens>,
  tone: PillTone,
): { readonly bg: string; readonly fg: string } {
  switch (tone) {
    case 'primary':
      return { bg: tokens.colors.status.infoSubtle, fg: tokens.colors.text.link };
    case 'success':
      return { bg: tokens.colors.status.successSubtle, fg: tokens.colors.status.success };
    case 'warning':
      return { bg: tokens.colors.status.warningSubtle, fg: tokens.colors.status.warning };
    case 'danger':
      return { bg: tokens.colors.status.dangerSubtle, fg: tokens.colors.status.danger };
    case 'info':
      return { bg: tokens.colors.status.infoSubtle, fg: tokens.colors.status.info };
    case 'neutral':
      return { bg: tokens.colors.background.subtle, fg: tokens.colors.text.primary };
  }
}

const BASE_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center',
  alignSelf: 'flex-start',
};

const PillImpl = React.forwardRef<View, PillProps>(function Pill(props, ref) {
  const { tone = 'neutral', leading, onPress, children, style, ...rest } = props;
  const tokens = useTokens();
  const c = pillColors(tokens, tone);
  const pillStyle: ViewStyle = {
    gap: tokens.space['3xs'],
    paddingHorizontal: tokens.space.xs,
    paddingVertical: tokens.space['3xs'],
    backgroundColor: c.bg,
    borderRadius: tokens.radii.pill,
  };
  const inner = (
    <>
      {leading ? <View>{leading}</View> : null}
      <Text variant="caption" weight="medium" style={{ color: c.fg }}>
        {children}
      </Text>
    </>
  );
  if (onPress) {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        accessibilityRole="button"
        style={[BASE_STYLE, pillStyle, style]}
        {...rest}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View ref={ref} accessibilityRole="text" style={[BASE_STYLE, pillStyle, style]} {...rest}>
      {inner}
    </View>
  );
});

PillImpl.displayName = 'Pill';

export const Pill = tagComponent(PillImpl, 'Pill');
