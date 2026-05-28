import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button } from '../Button/Button';
import { Text } from '../Text/Text';

import { Dialog } from './Dialog';

export interface ConfirmationDialogProps {
  readonly visible: boolean;
  /** Called when the dialog requests close (backdrop / hardware back). */
  readonly onClose: () => void;
  readonly title: string;
  readonly message?: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;
  readonly onConfirm: () => void;
  readonly onCancel?: () => void;
  /** Style the confirm button as a destructive action. Default false. */
  readonly destructive?: boolean;
  /** Style applied to the elevated dialog panel (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

const ConfirmationDialogImpl = React.forwardRef<View, ConfirmationDialogProps>(
  function ConfirmationDialog(props, ref) {
    const {
      visible,
      onClose,
      title,
      message,
      confirmLabel = 'Confirm',
      cancelLabel = 'Cancel',
      onConfirm,
      onCancel,
      destructive = false,
      style,
    } = props;

    const handleCancel = React.useCallback(() => {
      if (onCancel) onCancel();
      onClose();
    }, [onCancel, onClose]);

    const handleConfirm = React.useCallback(() => {
      onConfirm();
      onClose();
    }, [onConfirm, onClose]);

    const footer = (
      <>
        <Button variant="ghost" tone="neutral" onPress={handleCancel}>
          {cancelLabel}
        </Button>
        <Button variant="solid" tone={destructive ? 'danger' : 'primary'} onPress={handleConfirm}>
          {confirmLabel}
        </Button>
      </>
    );

    return (
      <Dialog
        ref={ref}
        visible={visible}
        onClose={handleCancel}
        title={title}
        accessibilityLabel={title}
        footer={footer}
        style={style}
      >
        {message ? <Text tone="secondary">{message}</Text> : null}
      </Dialog>
    );
  },
);

ConfirmationDialogImpl.displayName = 'ConfirmationDialog';

export const ConfirmationDialog = tagComponent(
  React.memo(ConfirmationDialogImpl),
  'ConfirmationDialog',
);
