import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import { Animated, Easing, type StyleProp, type View, type ViewStyle } from 'react-native';

import { useAnnouncer } from '../../a11y/useAnnouncer';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';

export interface ToastProps {
  readonly visible: boolean;
  readonly message: string;
  readonly tone?: ToastTone;
  readonly onDismiss?: () => void;
  /** Auto-dismiss after N ms. Set to 0 to disable. Defaults to 4000. */
  readonly duration?: number;
  /** Style applied to the toast surface. */
  readonly style?: StyleProp<ViewStyle>;
}

const ToastImpl = React.forwardRef<View, ToastProps>(function Toast(props, ref) {
  const { visible, message, tone = 'info', onDismiss, duration = 4000, style } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const announce = useAnnouncer();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      announce(message, { priority: tone === 'danger' ? 'assertive' : 'polite' });
    }
  }, [visible, message, tone, announce]);

  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(opacity, {
      toValue: visible ? 1 : 0,
      duration: tokens.duration.fast,
      easing: Easing.bezier(...tokens.easing.standard),
      useNativeDriver: true,
    }).start();
  }, [visible, reduceMotion, opacity, tokens.duration.fast, tokens.easing.standard]);

  React.useEffect(() => {
    if (!visible || !duration || !onDismiss) return undefined;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const bg =
    tone === 'success'
      ? tokens.colors.status.success
      : tone === 'danger'
        ? tokens.colors.status.danger
        : tone === 'warning'
          ? tokens.colors.status.warning
          : tokens.colors.background.inverse;

  const wrap: ViewStyle = {
    position: 'absolute',
    bottom: tokens.space.lg,
    left: tokens.space.lg,
    right: tokens.space.lg,
    backgroundColor: bg,
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.sm,
    borderRadius: tokens.radii.md,
    ...resolveShadow('lg'),
  };

  return (
    <Animated.View
      ref={ref}
      style={[wrap, style, { opacity }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text tone="inverse">{message}</Text>
    </Animated.View>
  );
});

ToastImpl.displayName = 'Toast';

export const Toast = tagComponent(ToastImpl, 'Toast');
