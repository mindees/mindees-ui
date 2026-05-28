import * as React from 'react';
import { Modal as RNModal, View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';

export interface FullscreenOverlayProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly children?: React.ReactNode;
  /** Hardware back dismisses. Default true. */
  readonly dismissible?: boolean;
  readonly accessibilityLabel?: string;
  /** Style applied to the fullscreen surface (token canvas background by default). */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Generic fullscreen modal surface covering the entire screen with the token
 * canvas background. Unlike Modal it is not centred and has no scrim/panel —
 * it is an opaque full-bleed surface for immersive flows (onboarding, editors,
 * media). Callers own all inner layout.
 */
const FullscreenOverlayImpl = React.forwardRef<View, FullscreenOverlayProps>(
  function FullscreenOverlay(props, ref) {
    const { visible, onClose, children, dismissible = true, accessibilityLabel, style } = props;
    const tokens = useTokens();
    const reduceMotion = useReduceMotion();

    const surface: ViewStyle = {
      flex: 1,
      backgroundColor: tokens.colors.background.canvas,
    };

    return (
      <RNModal
        visible={visible}
        onRequestClose={dismissible ? onClose : undefined}
        animationType={reduceMotion ? 'none' : 'slide'}
        presentationStyle="overFullScreen"
        transparent={false}
        accessibilityLabel={accessibilityLabel}
      >
        <View ref={ref} style={[surface, style]} accessibilityViewIsModal accessibilityRole="none">
          {children}
        </View>
      </RNModal>
    );
  },
);

FullscreenOverlayImpl.displayName = 'FullscreenOverlay';

export const FullscreenOverlay = tagComponent(
  React.memo(FullscreenOverlayImpl),
  'FullscreenOverlay',
);
