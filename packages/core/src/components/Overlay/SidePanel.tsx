import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Pressable,
  type StyleProp,
  type View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';

export interface SidePanelProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  /** Edge the panel is anchored to. Default `right`. */
  readonly side?: 'left' | 'right';
  readonly width?: number | `${number}%`;
  readonly children?: React.ReactNode;
  /** Tap outside / hardware back dismisses. Default true. */
  readonly dismissible?: boolean;
  readonly accessibilityLabel?: string;
  /** Style applied to the elevated panel surface (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Edge-anchored sliding panel. Like Drawer but content-flexible (no forced
 * padding on the inner pressable) so callers can render full-bleed headers,
 * scroll views or split layouts. Defaults to the trailing edge — the common
 * spot for detail / inspector panels.
 */
const SidePanelImpl = React.forwardRef<View, SidePanelProps>(function SidePanel(props, ref) {
  const {
    visible,
    onClose,
    side = 'right',
    width = '82%',
    children,
    dismissible = true,
    accessibilityLabel,
    style,
  } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const slide = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(slide, {
      toValue: visible ? 0 : side === 'left' ? -320 : 320,
      duration: tokens.duration.base,
      easing: Easing.bezier(...tokens.easing.standard),
      useNativeDriver: true,
    }).start();
  }, [visible, reduceMotion, slide, side, tokens.duration.base, tokens.easing.standard]);

  const stopPress = React.useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  }, []);

  const overlay: ViewStyle = {
    flex: 1,
    flexDirection: side === 'left' ? 'row' : 'row-reverse',
    backgroundColor: tokens.colors.overlay.scrim,
  };
  const panel: ViewStyle = {
    width,
    backgroundColor: tokens.colors.background.elevated,
    ...resolveShadow('xl'),
  };

  return (
    <RNModal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType="none"
      accessibilityLabel={accessibilityLabel}
    >
      <Pressable
        style={overlay}
        accessibilityRole="none"
        onPress={dismissible ? onClose : undefined}
      >
        <Animated.View style={[panel, style, { transform: [{ translateX: slide }] }]}>
          <Pressable
            ref={ref}
            style={PANEL_FILL}
            accessibilityViewIsModal
            accessibilityRole="none"
            onPress={stopPress}
          >
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
});

// Hoisted: token-free, caller-independent. Lets the inner pressable fill the
// animated panel so callers control their own padding / layout.
const PANEL_FILL = { flex: 1 } as const;

SidePanelImpl.displayName = 'SidePanel';

export const SidePanel = tagComponent(React.memo(SidePanelImpl), 'SidePanel');
