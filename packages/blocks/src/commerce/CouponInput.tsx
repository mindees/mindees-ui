import { CloseIcon } from '@mindees/icons';
import { Badge, Box, Button, FormField, HStack, IconButton, Input, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface CouponInputProps {
  /** Called with the trimmed, upper-cased code when "Apply" is pressed. */
  readonly onApply: (code: string) => void;
  /** Called when an applied coupon is removed. Omit to hide the remove control. */
  readonly onRemove?: () => void;
  /** The currently applied coupon code. When set, the applied state is shown. */
  readonly applied?: string;
  /** Validation/redemption error message. */
  readonly error?: string;
  /** Loading state for the apply action. */
  readonly loading?: boolean;
  /** Input placeholder. Defaults to "Coupon code". */
  readonly placeholder?: string;
  /** Apply button label. Defaults to "Apply". */
  readonly applyLabel?: string;
  /** Force the code input to upper case. Defaults to true. */
  readonly uppercase?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
});

const CouponInputImpl = React.forwardRef<View, CouponInputProps>(function CouponInput(props, ref) {
  const {
    onApply,
    onRemove,
    applied,
    error,
    loading = false,
    placeholder = 'Coupon code',
    applyLabel = 'Apply',
    uppercase = true,
    style,
  } = props;
  const tokens = useTokens();

  const [code, setCode] = React.useState('');

  const handleChange = React.useCallback(
    (text: string) => {
      setCode(uppercase ? text.toUpperCase() : text);
    },
    [uppercase],
  );

  const handleApply = React.useCallback(() => {
    const trimmed = code.trim();
    if (trimmed.length === 0) return;
    onApply(uppercase ? trimmed.toUpperCase() : trimmed);
  }, [code, onApply, uppercase]);

  const appliedRowStyle: ViewStyle = {
    borderWidth: 1,
    borderColor: tokens.colors.status.success,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.status.successSubtle,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.xs,
  };

  if (applied) {
    return (
      <HStack
        ref={ref}
        gap="sm"
        align="center"
        justify="space-between"
        style={[appliedRowStyle, style]}
      >
        <Badge tone="success" variant="solid">
          {applied}
        </Badge>
        {onRemove ? (
          <IconButton
            accessibilityLabel="Remove coupon"
            onPress={onRemove}
            tone="neutral"
            size="sm"
          >
            <CloseIcon size={16} color={tokens.colors.text.muted} />
          </IconButton>
        ) : null}
      </HStack>
    );
  }

  return (
    <FormField error={error} style={style}>
      <HStack gap="sm" align="start">
        <Box style={staticStyles.grow}>
          <Input
            value={code}
            onChangeText={handleChange}
            placeholder={placeholder}
            autoCapitalize={uppercase ? 'characters' : 'none'}
            autoCorrect={false}
            disabled={loading}
            returnKeyType="done"
            onSubmitEditing={handleApply}
            accessibilityLabel="Coupon code"
          />
        </Box>
        <Button
          onPress={handleApply}
          loading={loading}
          disabled={code.trim().length === 0}
          variant="outline"
          tone="neutral"
        >
          {applyLabel}
        </Button>
      </HStack>
    </FormField>
  );
});

CouponInputImpl.displayName = 'CouponInput';

export const CouponInput = React.memo(CouponInputImpl);
