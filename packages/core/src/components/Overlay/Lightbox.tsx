import { ChevronLeftIcon, ChevronRightIcon, CloseIcon } from '@mindees/icons';
import * as React from 'react';
import { Modal as RNModal, Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';
import { Image } from '../Display/Image';
import { Text } from '../Text/Text';

export interface LightboxImage {
  readonly uri: string;
}

export interface LightboxProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly images: readonly LightboxImage[];
  /** Index of the initially-shown image. Default 0. */
  readonly index?: number;
  readonly accessibilityLabel?: string;
  /** Style applied to the fullscreen viewer surface. */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Fullscreen image viewer. Tap the backdrop to dismiss; on multi-image sets,
 * prev/next controls page through. Uses a dark scrim surface so images read
 * against any theme. For pinch-zoom / fling-to-dismiss gestures, wrap a
 * gesture-handler image in `children` of FullscreenOverlay instead.
 */
const LightboxImpl = React.forwardRef<View, LightboxProps>(function Lightbox(props, ref) {
  const { visible, onClose, images, index = 0, accessibilityLabel, style } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const [current, setCurrent] = React.useState(index);

  // Re-sync to the caller's index whenever the viewer (re)opens.
  React.useEffect(() => {
    if (visible) setCurrent(index);
  }, [visible, index]);

  const count = images.length;
  const safeCurrent = count > 0 ? Math.min(Math.max(current, 0), count - 1) : 0;
  const hasMultiple = count > 1;

  const goPrev = React.useCallback(() => {
    setCurrent((c) => (c - 1 + count) % count);
  }, [count]);
  const goNext = React.useCallback(() => {
    setCurrent((c) => (c + 1) % count);
  }, [count]);

  const stopPress = React.useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
  }, []);

  const surface: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.overlay.scrimStrong,
    alignItems: 'center',
    justifyContent: 'center',
  };
  const closeButton: ViewStyle = {
    position: 'absolute',
    top: tokens.space.xl,
    right: tokens.space.lg,
    padding: tokens.space.sm,
  };
  const arrow: ViewStyle = {
    position: 'absolute',
    top: '50%',
    padding: tokens.space.sm,
  };
  const counter: ViewStyle = {
    position: 'absolute',
    bottom: tokens.space.xl,
    alignSelf: 'center',
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space['2xs'],
  };

  const active = images[safeCurrent];

  return (
    <RNModal
      visible={visible}
      transparent
      onRequestClose={onClose}
      animationType={reduceMotion ? 'none' : 'fade'}
      accessibilityLabel={accessibilityLabel}
    >
      <Pressable
        ref={ref}
        style={[surface, style]}
        accessibilityViewIsModal
        accessibilityRole="none"
        onPress={onClose}
      >
        {active ? (
          <Pressable accessibilityRole="image" onPress={stopPress} style={IMAGE_WRAP}>
            <Image src={active.uri} style={IMAGE_FILL} resizeMode="contain" />
          </Pressable>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close"
          hitSlop={8}
          onPress={onClose}
          style={closeButton}
        >
          <CloseIcon size={24} color={tokens.colors.text.inverse} />
        </Pressable>

        {hasMultiple ? (
          <>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Previous image"
              hitSlop={8}
              onPress={goPrev}
              style={[arrow, ARROW_LEFT]}
            >
              <ChevronLeftIcon size={28} color={tokens.colors.text.inverse} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Next image"
              hitSlop={8}
              onPress={goNext}
              style={[arrow, ARROW_RIGHT]}
            >
              <ChevronRightIcon size={28} color={tokens.colors.text.inverse} />
            </Pressable>
            <View style={counter} pointerEvents="none">
              <Text tone="inverse" variant="caption">{`${safeCurrent + 1} / ${count}`}</Text>
            </View>
          </>
        ) : null}
      </Pressable>
    </RNModal>
  );
});

// Hoisted: token-free, caller-independent fragments.
const IMAGE_WRAP = { width: '100%', height: '80%' } as const;
const IMAGE_FILL = { width: '100%', height: '100%' } as const;
const ARROW_LEFT = { left: 8 } as const;
const ARROW_RIGHT = { right: 8 } as const;

LightboxImpl.displayName = 'Lightbox';

export const Lightbox = tagComponent(React.memo(LightboxImpl), 'Lightbox');
