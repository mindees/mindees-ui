import * as React from 'react';
import { Platform, type Text as RNText, type ViewStyle, View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Text, type TextProps } from './Text';

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

export type KbdProps = Omit<TextProps, 'variant' | 'fontFamily'>;

/**
 * Keyboard-key visualisation. Wraps text in a small "keycap" with a border
 * and slight bottom shadow. Use for shortcuts in docs / help UI.
 *
 * @example <Kbd>⌘</Kbd> + <Kbd>K</Kbd>
 */
const KbdImpl = React.forwardRef<RNText, KbdProps>(function Kbd(props, ref) {
  const { children, style, ...rest } = props;
  const tokens = useTokens();
  const keycap: ViewStyle = {
    paddingHorizontal: tokens.space.xs,
    paddingVertical: 1,
    backgroundColor: tokens.colors.background.surface,
    borderColor: tokens.colors.border.default,
    borderWidth: 1,
    borderRadius: tokens.radii.sm,
    borderBottomWidth: 2,
  };
  return (
    <View style={keycap}>
      <Text ref={ref} variant="caption" fontFamily={monoFamily} style={style} {...rest}>
        {children}
      </Text>
    </View>
  );
});

KbdImpl.displayName = 'Kbd';

export const Kbd = tagComponent(KbdImpl, 'Kbd');
