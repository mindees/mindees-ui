import { Caption, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type Text as RNText, type TextStyle } from 'react-native';

/** Delivery state for an outgoing message. */
export type ReadReceiptStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface ReadReceiptProps {
  /** Current delivery state. */
  readonly status: ReadReceiptStatus;
  /** Style spread onto the root text node. */
  readonly style?: StyleProp<TextStyle>;
}

const GLYPH: Record<ReadReceiptStatus, string> = {
  sending: '◷', // clock
  sent: '✓', // single check
  delivered: '✓✓', // double check
  read: '✓✓', // double check (accent)
  failed: '✕', // cross
};

const LABEL: Record<ReadReceiptStatus, string> = {
  sending: 'Sending',
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
  failed: 'Failed to send',
};

const ReadReceiptImpl = React.forwardRef<RNText, ReadReceiptProps>(
  function ReadReceipt(props, ref) {
    const { status, style } = props;
    const tokens = useTokens();

    const color =
      status === 'read'
        ? tokens.colors.action.primary
        : status === 'failed'
          ? tokens.colors.status.danger
          : tokens.colors.text.muted;

    return (
      <Caption
        ref={ref}
        weight={status === 'read' ? 'semibold' : 'regular'}
        accessibilityLabel={LABEL[status]}
        style={[{ color }, style]}
      >
        {GLYPH[status]}
      </Caption>
    );
  },
);

ReadReceiptImpl.displayName = 'ReadReceipt';

export const ReadReceipt = React.memo(ReadReceiptImpl);
