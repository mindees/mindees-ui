import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import {
  Animated,
  Easing,
  Pressable,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';

import { useAnnouncer } from '../../a11y/useAnnouncer';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface SnackbarAction {
  readonly label: string;
  readonly onPress: () => void;
}

export interface SnackbarProps {
  readonly visible: boolean;
  readonly message: string;
  /** Optional single trailing action (e.g. "Undo"). */
  readonly action?: SnackbarAction;
  readonly onDismiss?: () => void;
  /**
   * Auto-dismiss after N ms. Unlike Toast, a Snackbar persists by default
   * (set to a positive value to auto-hide). Defaults to 0 (stays open).
   */
  readonly duration?: number;
  /** Style applied to the snackbar surface (not a scrim — it has none). */
  readonly style?: StyleProp<ViewStyle>;
}

const SnackbarImpl = React.forwardRef<View, SnackbarProps>(function Snackbar(props, ref) {
  const { visible, message, action, onDismiss, duration = 0, style } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const announce = useAnnouncer();
  const opacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) announce(message, { priority: 'polite' });
  }, [visible, message, announce]);

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

  const handleAction = React.useCallback(() => {
    if (action) action.onPress();
  }, [action]);

  if (!visible) return null;

  const wrap: ViewStyle = {
    position: 'absolute',
    bottom: tokens.space.lg,
    left: tokens.space.lg,
    right: tokens.space.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: tokens.space.md,
    backgroundColor: tokens.colors.background.inverse,
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.sm,
    minHeight: 48,
    borderRadius: tokens.radii.md,
    ...resolveShadow('lg'),
  };

  const actionStyle: ViewStyle = {
    paddingHorizontal: tokens.space.xs,
    paddingVertical: tokens.space['2xs'],
    minHeight: 44,
    justifyContent: 'center',
  };

  return (
    <Animated.View
      ref={ref}
      style={[wrap, style, { opacity }]}
      accessibilityLiveRegion="polite"
      accessibilityRole="alert"
    >
      <Text tone="inverse" style={SNACKBAR_MESSAGE_FLEX}>
        {message}
      </Text>
      {action ? (
        <Pressable
          onPress={handleAction}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          style={actionStyle}
        >
          <Text tone="link" weight="semibold">
            {action.label}
          </Text>
        </Pressable>
      ) : null}
    </Animated.View>
  );
});

// Hoisted: caller-independent and token-free, so it never needs re-allocating.
const SNACKBAR_MESSAGE_FLEX = { flexShrink: 1 } as const;

SnackbarImpl.displayName = 'Snackbar';

export const Snackbar = tagComponent(React.memo(SnackbarImpl), 'Snackbar');
