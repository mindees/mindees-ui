import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import { Animated, Easing, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { useAnnouncer } from '../../a11y/useAnnouncer';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type NotificationTone = 'info' | 'success' | 'warning' | 'danger';

export interface NotificationAction {
  readonly label: string;
  readonly onPress: () => void;
}

export interface NotificationProps {
  readonly visible: boolean;
  readonly title: string;
  readonly body?: string;
  readonly tone?: NotificationTone;
  /** Optional leading icon node. */
  readonly icon?: React.ReactNode;
  /** Optional action buttons rendered under the body. */
  readonly actions?: readonly NotificationAction[];
  readonly onDismiss?: () => void;
  /** Auto-dismiss after N ms. Set to 0 to disable. Defaults to 6000. */
  readonly duration?: number;
  /** Style applied to the notification card surface. */
  readonly style?: StyleProp<ViewStyle>;
}

function accentColor(tokens: ReturnType<typeof useTokens>, tone: NotificationTone): string {
  switch (tone) {
    case 'success':
      return tokens.colors.status.success;
    case 'warning':
      return tokens.colors.status.warning;
    case 'danger':
      return tokens.colors.status.danger;
    case 'info':
      return tokens.colors.status.info;
  }
}

const NotificationImpl = React.forwardRef<View, NotificationProps>(
  function Notification(props, ref) {
    const {
      visible,
      title,
      body,
      tone = 'info',
      icon,
      actions,
      onDismiss,
      duration = 6000,
      style,
    } = props;
    const tokens = useTokens();
    const reduceMotion = useReduceMotion();
    const announce = useAnnouncer();
    const opacity = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      if (visible) {
        announce(body ? `${title}. ${body}` : title, {
          priority: tone === 'danger' ? 'assertive' : 'polite',
        });
      }
    }, [visible, title, body, tone, announce]);

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

    const accent = accentColor(tokens, tone);

    const card: ViewStyle = {
      position: 'absolute',
      top: tokens.space.lg,
      left: tokens.space.lg,
      right: tokens.space.lg,
      flexDirection: 'row',
      gap: tokens.space.sm,
      backgroundColor: tokens.colors.background.elevated,
      borderLeftWidth: 3,
      borderLeftColor: accent,
      borderRadius: tokens.radii.lg,
      padding: tokens.space.md,
      ...resolveShadow('lg'),
    };

    const bodyColStyle: ViewStyle = { flexShrink: 1, gap: tokens.space['3xs'] };

    const actionsRowStyle: ViewStyle = {
      flexDirection: 'row',
      gap: tokens.space.md,
      marginTop: tokens.space.xs,
    };

    const actionStyle: ViewStyle = {
      paddingVertical: tokens.space['2xs'],
      minHeight: 32,
      justifyContent: 'center',
    };

    return (
      <Animated.View
        ref={ref}
        style={[card, style, { opacity }]}
        accessibilityRole="alert"
        accessibilityLiveRegion={tone === 'danger' ? 'assertive' : 'polite'}
      >
        {icon ? <View>{icon}</View> : null}
        <View style={bodyColStyle}>
          <Text tone="primary" weight="semibold">
            {title}
          </Text>
          {body ? <Text tone="secondary">{body}</Text> : null}
          {actions && actions.length > 0 ? (
            <View style={actionsRowStyle}>
              {actions.map((a) => (
                <Pressable
                  key={a.label}
                  onPress={a.onPress}
                  accessibilityRole="button"
                  accessibilityLabel={a.label}
                  style={actionStyle}
                >
                  <Text tone="link" weight="semibold">
                    {a.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          ) : null}
        </View>
      </Animated.View>
    );
  },
);

NotificationImpl.displayName = 'Notification';

export const Notification = tagComponent(React.memo(NotificationImpl), 'Notification');
