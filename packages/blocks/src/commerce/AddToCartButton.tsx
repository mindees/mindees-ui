import { Box, Button, HStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { QuantityStepper } from './QuantityStepper';

export interface AddToCartButtonProps {
  /** Called with the chosen quantity when the user adds the item. */
  readonly onAdd: (quantity: number) => void;
  /** Shows a spinner and disables interaction. */
  readonly loading?: boolean;
  /** Renders the "in cart" affordance (e.g. a checkmark label). */
  readonly inCart?: boolean;
  /** Disables the button regardless of loading state. */
  readonly disabled?: boolean;
  /** Show a quantity stepper beside the button. */
  readonly showQuantity?: boolean;
  /** Initial quantity when `showQuantity` is set. Defaults to 1. */
  readonly initialQuantity?: number;
  /** Maximum selectable quantity. Defaults to 99. */
  readonly maxQuantity?: number;
  /** Button label. Defaults to "Add to cart" (or "In cart" when `inCart`). */
  readonly label?: string;
  /** Make the button fill its container width. Defaults to true. */
  readonly fullWidth?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
});

const AddToCartButtonImpl = React.forwardRef<View, AddToCartButtonProps>(
  function AddToCartButton(props, ref) {
    const {
      onAdd,
      loading = false,
      inCart = false,
      disabled = false,
      showQuantity = false,
      initialQuantity = 1,
      maxQuantity = 99,
      label,
      fullWidth = true,
      style,
    } = props;

    const [quantity, setQuantity] = React.useState(initialQuantity);

    const handleAdd = React.useCallback(() => {
      onAdd(showQuantity ? quantity : 1);
    }, [onAdd, showQuantity, quantity]);

    const resolvedLabel = label ?? (inCart ? 'In cart' : 'Add to cart');

    const button = (
      <Button
        onPress={handleAdd}
        loading={loading}
        disabled={disabled}
        tone={inCart ? 'success' : 'primary'}
        variant={inCart ? 'outline' : 'solid'}
        fullWidth={fullWidth}
        accessibilityLabel={resolvedLabel}
      >
        {resolvedLabel}
      </Button>
    );

    if (!showQuantity) {
      return (
        <Box ref={ref} style={style}>
          {button}
        </Box>
      );
    }

    return (
      <HStack ref={ref} gap="sm" align="center" style={style}>
        <QuantityStepper
          value={quantity}
          onChange={setQuantity}
          max={maxQuantity}
          disabled={disabled || loading}
        />
        <Box style={staticStyles.grow}>{button}</Box>
      </HStack>
    );
  },
);

AddToCartButtonImpl.displayName = 'AddToCartButton';

export const AddToCartButton = React.memo(AddToCartButtonImpl);
