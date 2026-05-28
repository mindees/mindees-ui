import { ConfirmationDialog } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

export interface LogoutConfirmationProps {
  /** Controls visibility. */
  readonly visible: boolean;
  /** Called when the user confirms sign-out. */
  readonly onConfirm: () => void;
  /** Called when the user cancels (button, backdrop, or hardware back). */
  readonly onCancel: () => void;
  /** Dialog title. Defaults to "Sign out?". */
  readonly title?: string;
  /** Supporting message under the title. */
  readonly message?: string;
  /** Confirm button label. Defaults to "Sign out". */
  readonly confirmLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  readonly cancelLabel?: string;
  /** Style applied to the elevated dialog panel. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_MESSAGE = 'You will need to sign in again to access your account.';

const LogoutConfirmationImpl = React.forwardRef<View, LogoutConfirmationProps>(
  function LogoutConfirmation(props, ref) {
    const {
      visible,
      onConfirm,
      onCancel,
      title = 'Sign out?',
      message = DEFAULT_MESSAGE,
      confirmLabel = 'Sign out',
      cancelLabel = 'Cancel',
      style,
    } = props;

    return (
      <ConfirmationDialog
        ref={ref}
        visible={visible}
        title={title}
        message={message}
        confirmLabel={confirmLabel}
        cancelLabel={cancelLabel}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={onCancel}
        destructive
        style={style}
      />
    );
  },
);

LogoutConfirmationImpl.displayName = 'LogoutConfirmation';

export const LogoutConfirmation = React.memo(LogoutConfirmationImpl);
