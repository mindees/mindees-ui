import {
  Badge,
  Button,
  Card,
  Caption,
  HStack,
  IconButton,
  Text,
  useTokens,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** A saved payment card. Card numbers are never handled — last4 only. */
export interface PaymentMethod {
  /** Stable identity used for remove/set-default callbacks. */
  readonly id: string;
  /** Card brand, e.g. "Visa". */
  readonly brand: string;
  /** Last four digits, e.g. "4242". */
  readonly last4: string;
  /** Pre-formatted expiry, e.g. "08/27". */
  readonly expiry?: string;
  /** Whether this is the default method. */
  readonly isDefault?: boolean;
}

export interface PaymentMethodsProps {
  /** Saved payment methods. */
  readonly methods: readonly PaymentMethod[];
  /** Shows an "Add payment method" button when provided. */
  readonly onAdd?: () => void;
  /** Called with the method id when the user removes a card. */
  readonly onRemove?: (id: string) => void;
  /** Called with the method id when the user makes a card the default. */
  readonly onSetDefault?: (id: string) => void;
  /** Label for the add button. Defaults to "Add payment method". */
  readonly addLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { alignItems: 'center' },
  info: { flexShrink: 1 },
  actions: { alignItems: 'center' },
  add: { alignSelf: 'flex-start' },
});

interface PaymentRowProps {
  readonly method: PaymentMethod;
  readonly onRemove?: (id: string) => void;
  readonly onSetDefault?: (id: string) => void;
}

const PaymentRow = React.memo(function PaymentRow(props: PaymentRowProps) {
  const { method, onRemove, onSetDefault } = props;
  const { id, brand, last4, expiry, isDefault } = method;

  const handleRemove = React.useCallback(() => {
    onRemove?.(id);
  }, [onRemove, id]);

  const handleSetDefault = React.useCallback(() => {
    onSetDefault?.(id);
  }, [onSetDefault, id]);

  return (
    <Card variant="outlined" density="compact">
      <HStack gap="sm" justify="space-between" style={staticStyles.row}>
        <VStack gap="3xs" style={staticStyles.info}>
          <HStack gap="2xs" align="center">
            <Text weight="medium">
              {brand} •••• {last4}
            </Text>
            {isDefault ? (
              <Badge tone="primary" variant="subtle">
                Default
              </Badge>
            ) : null}
          </HStack>
          {expiry ? <Caption tone="muted">Expires {expiry}</Caption> : null}
        </VStack>

        <HStack gap="2xs" style={staticStyles.actions}>
          {onSetDefault && !isDefault ? (
            <Button variant="ghost" tone="primary" size="sm" onPress={handleSetDefault}>
              Set default
            </Button>
          ) : null}
          {onRemove ? (
            <IconButton
              tone="danger"
              size="sm"
              onPress={handleRemove}
              accessibilityLabel={`Remove ${brand} ending ${last4}`}
            >
              <RemoveGlyph />
            </IconButton>
          ) : null}
        </HStack>
      </HStack>
    </Card>
  );
});
PaymentRow.displayName = 'PaymentMethods.PaymentRow';

const RemoveGlyph = React.memo(function RemoveGlyph() {
  const tokens = useTokens();
  return (
    <Text weight="bold" style={{ color: tokens.colors.status.danger }} accessibilityElementsHidden>
      ✕
    </Text>
  );
});
RemoveGlyph.displayName = 'PaymentMethods.RemoveGlyph';

const PaymentMethodsImpl = React.forwardRef<View, PaymentMethodsProps>(
  function PaymentMethods(props, ref) {
    const {
      methods,
      onAdd,
      onRemove,
      onSetDefault,
      addLabel = 'Add payment method',
      style,
    } = props;

    return (
      <VStack ref={ref} gap="sm" style={style}>
        {methods.map((method) => (
          <PaymentRow
            key={method.id}
            method={method}
            onRemove={onRemove}
            onSetDefault={onSetDefault}
          />
        ))}

        {onAdd ? (
          <Button variant="outline" tone="primary" onPress={onAdd} style={staticStyles.add}>
            {addLabel}
          </Button>
        ) : null}
      </VStack>
    );
  },
);

PaymentMethodsImpl.displayName = 'PaymentMethods';

export const PaymentMethods = React.memo(PaymentMethodsImpl);
