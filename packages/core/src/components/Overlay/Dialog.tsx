import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

import { Modal } from './Modal';

export interface DialogProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  /** Tap outside / hardware back dismisses. Default true. */
  readonly dismissible?: boolean;
  readonly title?: string;
  /** Short supporting line under the title. */
  readonly description?: string;
  /** Body content rendered between the header and the footer. */
  readonly children?: React.ReactNode;
  /** Footer slot — typically action buttons. Aligned to the trailing edge. */
  readonly footer?: React.ReactNode;
  readonly accessibilityLabel?: string;
  /** Style applied to the elevated dialog panel (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

const DialogImpl = React.forwardRef<View, DialogProps>(function Dialog(props, ref) {
  const {
    visible,
    onClose,
    dismissible = true,
    title,
    description,
    children,
    footer,
    accessibilityLabel,
    style,
  } = props;
  const tokens = useTokens();

  const headerStyle: ViewStyle = { gap: tokens.space['2xs'], marginBottom: tokens.space.md };
  const bodyStyle: ViewStyle = { gap: tokens.space.sm };
  const footerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: tokens.space.sm,
    marginTop: tokens.space.lg,
  };

  return (
    <Modal
      ref={ref}
      visible={visible}
      onClose={onClose}
      dismissible={dismissible}
      centered
      accessibilityLabel={accessibilityLabel ?? title}
      style={style}
    >
      <View accessibilityViewIsModal accessibilityRole="none">
        {title || description ? (
          <View style={headerStyle}>
            {title ? <Heading level={3}>{title}</Heading> : null}
            {description ? <Text tone="secondary">{description}</Text> : null}
          </View>
        ) : null}
        {children ? <View style={bodyStyle}>{children}</View> : null}
        {footer ? <View style={footerStyle}>{footer}</View> : null}
      </View>
    </Modal>
  );
});

DialogImpl.displayName = 'Dialog';

export const Dialog = tagComponent(React.memo(DialogImpl), 'Dialog');
