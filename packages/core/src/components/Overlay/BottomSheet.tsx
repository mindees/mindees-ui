import * as React from 'react';
import {
  Animated,
  Easing,
  Modal as RNModal,
  Pressable,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';

export interface BottomSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly dismissible?: boolean;
  /** Sheet height. Number = dp; string = any RN DimensionValue (`'60%'`, `'auto'`). */
  readonly height?: number | `${number}%` | 'auto';
  readonly children?: React.ReactNode;
  /** Style applied to the elevated sheet surface (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Minimum-deps bottom sheet. For full pan-gesture snapping (multiple stops,
 * blur backdrop, content-aware sizing) consume `@gorhom/bottom-sheet`
 * directly — this implementation favours zero peer-deps and predictable
 * behaviour for simple show/dismiss flows.
 */
const BottomSheetImpl = React.forwardRef<View, BottomSheetProps>(function BottomSheet(props, ref) {
  const { visible, onClose, dismissible = true, height = '60%', children, style } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (reduceMotion) return;
    Animated.timing(translateY, {
      toValue: visible ? 0 : 200,
      duration: tokens.duration.base,
      easing: Easing.bezier(...tokens.easing.standard),
      useNativeDriver: true,
    }).start();
  }, [visible, reduceMotion, translateY, tokens.duration.base, tokens.easing.standard]);

  const overlay: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.overlay.scrim,
    justifyContent: 'flex-end',
  };

  const sheet: ViewStyle = {
    backgroundColor: tokens.colors.background.elevated,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    paddingTop: tokens.space.md,
    paddingHorizontal: tokens.space.lg,
    paddingBottom: tokens.space.lg,
    height,
    ...resolveShadow('xl'),
  };

  const handleStyle: ViewStyle = {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: tokens.colors.border.strong,
    alignSelf: 'center',
    marginBottom: tokens.space.sm,
  };

  return (
    <RNModal visible={visible} transparent onRequestClose={onClose} animationType="none">
      <Pressable style={overlay} onPress={dismissible ? onClose : undefined}>
        <Animated.View style={[sheet, style, { transform: [{ translateY }] }]}>
          <Pressable ref={ref} accessibilityRole="none" onPress={(e) => e.stopPropagation()}>
            <View style={handleStyle} />
            {children}
          </Pressable>
        </Animated.View>
      </Pressable>
    </RNModal>
  );
});

BottomSheetImpl.displayName = 'BottomSheet';

export const BottomSheet = tagComponent(BottomSheetImpl, 'BottomSheet');
