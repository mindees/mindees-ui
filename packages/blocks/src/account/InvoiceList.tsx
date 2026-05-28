import { Badge, Button, Caption, Divider, HStack, Text, VStack, type BadgeTone } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export type InvoiceStatus = 'paid' | 'pending' | 'failed' | 'refunded';

/** A single invoice line. */
export interface Invoice {
  /** Stable identity used for the download callback. */
  readonly id: string;
  /** Pre-formatted issue date, e.g. "May 1, 2026". */
  readonly date: string;
  /** Pre-formatted amount, e.g. "$12.00". */
  readonly amount: string;
  readonly status: InvoiceStatus;
}

export interface InvoiceListProps {
  /** Invoices to render, newest first by convention. */
  readonly invoices: readonly Invoice[];
  /** Called with the invoice id when the user downloads it. */
  readonly onDownload?: (id: string) => void;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const STATUS_TONE: Record<InvoiceStatus, BadgeTone> = {
  paid: 'success',
  pending: 'warning',
  failed: 'danger',
  refunded: 'neutral',
};

const STATUS_LABEL: Record<InvoiceStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  failed: 'Failed',
  refunded: 'Refunded',
};

const staticStyles = StyleSheet.create({
  row: { alignItems: 'center' },
  info: { flexShrink: 1 },
  meta: { alignItems: 'center' },
});

interface InvoiceRowProps {
  readonly invoice: Invoice;
  readonly onDownload?: (id: string) => void;
}

const InvoiceRow = React.memo(function InvoiceRow(props: InvoiceRowProps) {
  const { invoice, onDownload } = props;
  const { id, date, amount, status } = invoice;

  const handleDownload = React.useCallback(() => {
    onDownload?.(id);
  }, [onDownload, id]);

  return (
    <HStack gap="md" justify="space-between" style={staticStyles.row}>
      <VStack gap="3xs" style={staticStyles.info}>
        <Text weight="medium">{amount}</Text>
        <Caption tone="muted">{date}</Caption>
      </VStack>

      <HStack gap="sm" style={staticStyles.meta}>
        <Badge tone={STATUS_TONE[status]} variant="subtle">
          {STATUS_LABEL[status]}
        </Badge>
        {onDownload ? (
          <Button
            variant="ghost"
            tone="primary"
            size="sm"
            onPress={handleDownload}
            accessibilityLabel={`Download invoice ${date}`}
          >
            Download
          </Button>
        ) : null}
      </HStack>
    </HStack>
  );
});
InvoiceRow.displayName = 'InvoiceList.InvoiceRow';

const InvoiceListImpl = React.forwardRef<View, InvoiceListProps>(function InvoiceList(props, ref) {
  const { invoices, onDownload, style } = props;
  return (
    <VStack ref={ref} gap="sm" style={style}>
      {invoices.map((invoice, index) => (
        <React.Fragment key={invoice.id}>
          {index > 0 ? <Divider /> : null}
          <InvoiceRow invoice={invoice} onDownload={onDownload} />
        </React.Fragment>
      ))}
    </VStack>
  );
});

InvoiceListImpl.displayName = 'InvoiceList';

export const InvoiceList = React.memo(InvoiceListImpl);
