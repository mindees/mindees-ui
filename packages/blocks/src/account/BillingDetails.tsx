import { Button, Card, Heading, KeyValueRow, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** A single read-only billing field. */
export interface BillingDetail {
  /** Stable identity for list rendering. */
  readonly id: string;
  readonly label: string;
  readonly value: string;
}

export interface BillingDetailsProps {
  /** Read-only billing rows (name, email, address, tax id…). */
  readonly details: readonly BillingDetail[];
  /** Optional section heading. Defaults to "Billing details". */
  readonly title?: string;
  /** Shows an edit button when provided. */
  readonly onEdit?: () => void;
  /** Label for the edit button. Defaults to "Edit". */
  readonly editLabel?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  edit: { alignSelf: 'flex-start' },
});

const BillingDetailsImpl = React.forwardRef<View, BillingDetailsProps>(
  function BillingDetails(props, ref) {
    const { details, title = 'Billing details', onEdit, editLabel = 'Edit', style } = props;

    return (
      <Card ref={ref} style={style}>
        <VStack gap="sm">
          <Heading level={5}>{title}</Heading>

          <VStack gap="3xs">
            {details.map((detail, index) => (
              <KeyValueRow
                key={detail.id}
                label={detail.label}
                value={detail.value}
                divider={index < details.length - 1}
              />
            ))}
          </VStack>

          {onEdit ? (
            <Button
              variant="outline"
              tone="neutral"
              size="sm"
              onPress={onEdit}
              style={staticStyles.edit}
            >
              {editLabel}
            </Button>
          ) : null}
        </VStack>
      </Card>
    );
  },
);

BillingDetailsImpl.displayName = 'BillingDetails';

export const BillingDetails = React.memo(BillingDetailsImpl);
