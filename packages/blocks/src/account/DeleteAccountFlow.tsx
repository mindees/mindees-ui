import { Button, Caption, Card, ConfirmationDialog, Heading, useTokens, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

export interface DeleteAccountFlowProps {
  /** Called when the user confirms account deletion in the dialog. */
  readonly onDelete: () => void;
  /** Disables the trigger and confirm action while a deletion is in flight. */
  readonly loading?: boolean;
  /** Section heading. Defaults to "Delete account". */
  readonly title?: string;
  /** Supporting copy in the danger card. */
  readonly description?: string;
  /** Trigger button label. Defaults to "Delete account". */
  readonly triggerLabel?: string;
  /** Dialog title. Defaults to "Delete account?". */
  readonly confirmTitle?: string;
  /** Dialog message. */
  readonly confirmMessage?: string;
  /** Dialog confirm button label. Defaults to "Delete". */
  readonly confirmLabel?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_DESCRIPTION =
  'Permanently delete your account and all associated data. This cannot be undone.';
const DEFAULT_CONFIRM_MESSAGE =
  'This will permanently delete your account and all of its data. This action cannot be undone.';

const DeleteAccountFlowImpl = React.forwardRef<View, DeleteAccountFlowProps>(
  function DeleteAccountFlow(props, ref) {
    const {
      onDelete,
      loading = false,
      title = 'Delete account',
      description = DEFAULT_DESCRIPTION,
      triggerLabel = 'Delete account',
      confirmTitle = 'Delete account?',
      confirmMessage = DEFAULT_CONFIRM_MESSAGE,
      confirmLabel = 'Delete',
      style,
    } = props;
    const tokens = useTokens();

    const [visible, setVisible] = React.useState(false);

    const open = React.useCallback(() => {
      setVisible(true);
    }, []);
    const close = React.useCallback(() => {
      setVisible(false);
    }, []);
    const confirm = React.useCallback(() => {
      onDelete();
    }, [onDelete]);

    const dangerCardStyle: ViewStyle = { borderColor: tokens.colors.status.danger };

    return (
      <Card ref={ref} variant="outlined" style={[dangerCardStyle, style]}>
        <VStack gap="sm">
          <Heading level={5} tone="danger">
            {title}
          </Heading>
          <Caption tone="muted">{description}</Caption>
          <Button variant="solid" tone="danger" onPress={open} loading={loading} disabled={loading}>
            {triggerLabel}
          </Button>
        </VStack>

        <ConfirmationDialog
          visible={visible}
          title={confirmTitle}
          message={confirmMessage}
          confirmLabel={confirmLabel}
          onConfirm={confirm}
          onCancel={close}
          onClose={close}
          destructive
        />
      </Card>
    );
  },
);

DeleteAccountFlowImpl.displayName = 'DeleteAccountFlow';

export const DeleteAccountFlow = React.memo(DeleteAccountFlowImpl);
