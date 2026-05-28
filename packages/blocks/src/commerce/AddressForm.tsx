import { Button, FormField, HStack, Input, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

/** Postal address captured by `AddressForm`. */
export interface AddressValue {
  readonly name: string;
  readonly street: string;
  readonly city: string;
  readonly state: string;
  readonly zip: string;
  readonly country: string;
}

export interface AddressFormProps {
  /** Controlled address value. When omitted, the form manages its own state. */
  readonly value?: Partial<AddressValue>;
  /** Called with the full address on every field change (controlled mode). */
  readonly onChange?: (value: AddressValue) => void;
  /** Called with the address when the submit button is pressed. */
  readonly onSubmit?: (value: AddressValue) => void;
  /** Submit button label. Omit `onSubmit` to hide the button. */
  readonly submitLabel?: string;
  /** Disable inputs and show a spinner on the submit button. */
  readonly loading?: boolean;
  /** Per-field validation errors, keyed by field name. */
  readonly errors?: Partial<Record<keyof AddressValue, string>>;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const EMPTY_ADDRESS: AddressValue = {
  name: '',
  street: '',
  city: '',
  state: '',
  zip: '',
  country: '',
};

const GROW_STYLE: ViewStyle = { flex: 1 };

const AddressFormImpl = React.forwardRef<View, AddressFormProps>(function AddressForm(props, ref) {
  const {
    value,
    onChange,
    onSubmit,
    submitLabel = 'Save address',
    loading = false,
    errors,
    style,
  } = props;

  const [internal, setInternal] = React.useState<AddressValue>(EMPTY_ADDRESS);

  // When `value` is provided the form is controlled; otherwise we track our own.
  const current = React.useMemo<AddressValue>(
    () => (value ? { ...EMPTY_ADDRESS, ...value } : internal),
    [value, internal],
  );

  const update = React.useCallback(
    (field: keyof AddressValue, fieldValue: string) => {
      const next = { ...current, [field]: fieldValue };
      if (!value) setInternal(next);
      onChange?.(next);
    },
    [current, value, onChange],
  );

  const setName = React.useCallback((t: string) => update('name', t), [update]);
  const setStreet = React.useCallback((t: string) => update('street', t), [update]);
  const setCity = React.useCallback((t: string) => update('city', t), [update]);
  const setState = React.useCallback((t: string) => update('state', t), [update]);
  const setZip = React.useCallback((t: string) => update('zip', t), [update]);
  const setCountry = React.useCallback((t: string) => update('country', t), [update]);

  const handleSubmit = React.useCallback(() => {
    onSubmit?.(current);
  }, [onSubmit, current]);

  return (
    <VStack ref={ref} gap="md" style={style}>
      <FormField label="Full name" error={errors?.name}>
        <Input
          value={current.name}
          onChangeText={setName}
          placeholder="Jane Doe"
          autoComplete="name"
          textContentType="name"
          disabled={loading}
          accessibilityLabel="Full name"
        />
      </FormField>

      <FormField label="Street address" error={errors?.street}>
        <Input
          value={current.street}
          onChangeText={setStreet}
          placeholder="123 Main St"
          autoComplete="street-address"
          textContentType="fullStreetAddress"
          disabled={loading}
          accessibilityLabel="Street address"
        />
      </FormField>

      <FormField label="City" error={errors?.city}>
        <Input
          value={current.city}
          onChangeText={setCity}
          placeholder="Springfield"
          autoComplete="postal-address-locality"
          disabled={loading}
          accessibilityLabel="City"
        />
      </FormField>

      <HStack gap="sm" align="start">
        <FormField label="State / Region" error={errors?.state} style={GROW_STYLE}>
          <Input
            value={current.state}
            onChangeText={setState}
            placeholder="CA"
            autoComplete="postal-address-region"
            disabled={loading}
            accessibilityLabel="State or region"
          />
        </FormField>

        <FormField label="ZIP / Postal" error={errors?.zip} style={GROW_STYLE}>
          <Input
            value={current.zip}
            onChangeText={setZip}
            placeholder="94000"
            keyboardType="numbers-and-punctuation"
            autoComplete="postal-code"
            textContentType="postalCode"
            disabled={loading}
            accessibilityLabel="ZIP or postal code"
          />
        </FormField>
      </HStack>

      <FormField label="Country" error={errors?.country}>
        <Input
          value={current.country}
          onChangeText={setCountry}
          placeholder="United States"
          autoComplete="country"
          textContentType="countryName"
          disabled={loading}
          returnKeyType="done"
          onSubmitEditing={onSubmit ? handleSubmit : undefined}
          accessibilityLabel="Country"
        />
      </FormField>

      {onSubmit ? (
        <Button onPress={handleSubmit} loading={loading} fullWidth>
          {submitLabel}
        </Button>
      ) : null}
    </VStack>
  );
});

AddressFormImpl.displayName = 'AddressForm';

export const AddressForm = React.memo(AddressFormImpl);
