import * as React from 'react';
import { Modal as RNModal, Pressable, type View, type ViewStyle } from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens, useReduceMotion } from '../../theme/ThemeProvider';

export interface ModalProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly dismissible?: boolean;
  readonly children?: React.ReactNode;
  /** Center the modal panel; otherwise content fills the screen. */
  readonly centered?: boolean;
  readonly accessibilityLabel?: string;
}

const ModalImpl = React.forwardRef<View, ModalProps>(function Modal(props, _ref) {
  const {
    visible,
    onClose,
    dismissible = true,
    centered = true,
    children,
    accessibilityLabel,
  } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();

  const overlayStyle: ViewStyle = {
    flex: 1,
    backgroundColor: tokens.colors.overlay.scrim,
    alignItems: centered ? 'center' : 'stretch',
    justifyContent: centered ? 'center' : 'flex-end',
    padding: centered ? tokens.space.lg : 0,
  };

  const panelStyle: ViewStyle = {
    backgroundColor: tokens.colors.background.elevated,
    borderRadius: tokens.radii.xl,
    padding: tokens.space.lg,
    maxWidth: centered ? 480 : undefined,
    width: centered ? '100%' : undefined,
    ...resolveShadow('xl'),
  };

  return (
    <RNModal
      visible={visible}
      onRequestClose={onClose}
      transparent
      animationType={reduceMotion ? 'none' : 'fade'}
      accessibilityLabel={accessibilityLabel}
    >
      <Pressable
        style={overlayStyle}
        accessibilityRole="none"
        onPress={dismissible ? onClose : undefined}
      >
        <Pressable style={panelStyle} accessibilityRole="none" onPress={(e) => e.stopPropagation()}>
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  );
});

ModalImpl.displayName = 'Modal';

export const Modal = tagComponent(ModalImpl, 'Modal');
