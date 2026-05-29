import { Button, Dialog, RadioGroup, Radio, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

/** A single selectable report reason. */
export interface ReportReason {
  /** Stable identity submitted back to the caller. */
  readonly key: string;
  /** Human-readable reason label. */
  readonly label: string;
}

export interface ReportContentModalProps {
  /** Controls visibility. */
  readonly visible: boolean;
  /** Available reasons to choose from. */
  readonly reasons: readonly ReportReason[];
  /** Called with the selected reason key when submitted. */
  readonly onSubmit: (key: string) => void;
  /** Called when the dialog is dismissed without submitting. */
  readonly onClose: () => void;
  /** Dialog title. Defaults to "Report content". */
  readonly title?: string;
  /** Supporting line under the title. */
  readonly description?: string;
  /** Submit button label. Defaults to "Submit report". */
  readonly submitLabel?: string;
  /** Cancel button label. Defaults to "Cancel". */
  readonly cancelLabel?: string;
  /** Style applied to the elevated dialog panel. */
  readonly style?: StyleProp<ViewStyle>;
}

const ReportContentModalImpl = React.forwardRef<View, ReportContentModalProps>(
  function ReportContentModal(props, ref) {
    const {
      visible,
      reasons,
      onSubmit,
      onClose,
      title = 'Report content',
      description = 'Help us understand the problem.',
      submitLabel = 'Submit report',
      cancelLabel = 'Cancel',
      style,
    } = props;

    const [selected, setSelected] = React.useState<string | undefined>(undefined);

    // Reset the selection whenever the dialog is (re)opened.
    React.useEffect(() => {
      if (visible) setSelected(undefined);
    }, [visible]);

    const handleSubmit = React.useCallback(() => {
      if (selected !== undefined) onSubmit(selected);
    }, [selected, onSubmit]);

    const footer = (
      <>
        <Button variant="ghost" tone="neutral" onPress={onClose}>
          {cancelLabel}
        </Button>
        <Button
          variant="solid"
          tone="danger"
          onPress={handleSubmit}
          disabled={selected === undefined}
        >
          {submitLabel}
        </Button>
      </>
    );

    return (
      <Dialog
        ref={ref}
        visible={visible}
        onClose={onClose}
        title={title}
        description={description}
        accessibilityLabel={title}
        footer={footer}
        style={style}
      >
        <RadioGroup name="report-reason" value={selected} onValueChange={setSelected}>
          <VStack gap="sm">
            {reasons.map((reason) => (
              <Radio key={reason.key} value={reason.key} label={reason.label} />
            ))}
          </VStack>
        </RadioGroup>
      </Dialog>
    );
  },
);

ReportContentModalImpl.displayName = 'ReportContentModal';

export const ReportContentModal = React.memo(ReportContentModalImpl);
