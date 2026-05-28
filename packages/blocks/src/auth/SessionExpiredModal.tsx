import { Button, Dialog } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

export interface SessionExpiredModalProps {
  /** Controls visibility. */
  readonly visible: boolean;
  /** Called when the user chooses to sign in again. */
  readonly onReauthenticate: () => void;
  /**
   * Called when the user dismisses without re-authenticating (backdrop /
   * hardware back / dismiss button). When omitted, the modal is non-dismissible
   * and only the re-authenticate action is offered.
   */
  readonly onDismiss?: () => void;
  /** Dialog title. Defaults to "Session expired". */
  readonly title?: string;
  /** Supporting message under the title. */
  readonly description?: string;
  /** Re-authenticate button label. Defaults to "Sign in again". */
  readonly reauthenticateLabel?: string;
  /** Dismiss button label. Only shown when `onDismiss` is provided. */
  readonly dismissLabel?: string;
  /** Style applied to the elevated dialog panel. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_DESCRIPTION = 'Your session has expired. Please sign in again to continue.';

const noop = (): void => undefined;

const SessionExpiredModalImpl = React.forwardRef<View, SessionExpiredModalProps>(
  function SessionExpiredModal(props, ref) {
    const {
      visible,
      onReauthenticate,
      onDismiss,
      title = 'Session expired',
      description = DEFAULT_DESCRIPTION,
      reauthenticateLabel = 'Sign in again',
      dismissLabel = 'Dismiss',
      style,
    } = props;

    const dismissible = onDismiss !== undefined;

    const footer = (
      <>
        {onDismiss ? (
          <Button variant="ghost" tone="neutral" onPress={onDismiss}>
            {dismissLabel}
          </Button>
        ) : null}
        <Button variant="solid" tone="primary" onPress={onReauthenticate}>
          {reauthenticateLabel}
        </Button>
      </>
    );

    return (
      <Dialog
        ref={ref}
        visible={visible}
        onClose={onDismiss ?? noop}
        dismissible={dismissible}
        title={title}
        description={description}
        accessibilityLabel={title}
        footer={footer}
        style={style}
      />
    );
  },
);

SessionExpiredModalImpl.displayName = 'SessionExpiredModal';

export const SessionExpiredModal = React.memo(SessionExpiredModalImpl);
