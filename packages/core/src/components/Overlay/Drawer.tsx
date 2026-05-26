import * as React from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Pressable,
  type View,
  type ViewStyle,
} from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';

export interface DrawerProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly side?: 'left' | 'right';
  readonly width?: number | `${number}%`;
  readonly children?: React.ReactNode;
  readonly dismissible?: boolean;
}

const DrawerImpl = React.forwardRef<View, DrawerProps>(function Drawer(props, _ref) {
  const { visible, onClose, side = 'left', width = '80%', children, dismissible = true } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const slide = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(slide, {
      toValue: visible ? 0 : side === 'left' ? -300 : 300,
      duration: tokens.duration.base,
      easing: Easing.bezier(...tokens.easing.standard),
      useNativeDriver: true,
    }).start();
  }, [visible, reduceMotion, slide, side, tokens.duration.base, tokens.easing.standard]);

  const overlay: ViewStyle = {
    flex: 1,
    flexDirection: side === 'left' ? 'row' : 'row-reverse',
    backgroundColor: tokens.colors.overlay.scrim,
  };
  const panel: ViewStyle = {
    width,
    backgroundColor: tokens.colors.background.elevated,
    padding: tokens.space.lg,
    ...resolveShadow('xl'),
  };

  return (
    <RNModal visible={visible} transparent onRequestClose={onClose} animationType="none">
      <Pressable style={overlay} onPress={dismissible ? onClose : undefined}>
        <Animated.View style={[panel, { transform: [{ translateX: slide }] }]}>
          <Pressable accessibilityRole="none" onPress={(e) => e.stopPropagation()}>
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
});

DrawerImpl.displayName = 'Drawer';

export const Drawer = tagComponent(DrawerImpl, 'Drawer');
