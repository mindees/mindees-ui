import { Button, EmailInput, FormField, Heading, PhoneInput, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { AddressForm, type AddressValue } from './AddressForm';

/** Values produced when the checkout form is submitted. */
export interface CheckoutValues {
  readonly email: string;
  readonly phone: string;
  readonly shipping: AddressValue;
}

export interface CheckoutFormProps {
  /** Called with contact + shipping details when the order is placed. */
  readonly onSubmit: (values: CheckoutValues) => void;
  /** Disable inputs and show a spinner on the place-order button. */
  readonly loading?: boolean;
  /** Top-level error message, announced to assistive tech. */
  readonly error?: string;
  /** Per-field validation errors for contact fields. */
  readonly errors?: { readonly email?: string; readonly phone?: string };
  /** Validation errors for shipping address fields. */
  readonly addressErrors?: Partial<Record<keyof AddressValue, string>>;
  /** Place-order button label. Defaults to "Place order". */
  readonly submitLabel?: string;
  /** Slot rendered above the submit button (e.g. an order summary). */
  readonly footer?: React.ReactNode;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const CheckoutFormImpl = React.forwardRef<View, CheckoutFormProps>(
  function CheckoutForm(props, ref) {
    const {
      onSubmit,
      loading = false,
      error,
      errors,
      addressErrors,
      submitLabel = 'Place order',
      footer,
      style,
    } = props;

    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const shippingRef = React.useRef<AddressValue>({
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      country: '',
    });

    const handleAddressChange = React.useCallback((value: AddressValue) => {
      shippingRef.current = value;
    }, []);

    const handleSubmit = React.useCallback(() => {
      onSubmit({ email: email.trim(), phone: phone.trim(), shipping: shippingRef.current });
    }, [onSubmit, email, phone]);

    return (
      <VStack ref={ref} gap="lg" style={style}>
        {error ? <FormField error={error} accessibilityLiveRegion="polite" /> : null}

        <VStack gap="md">
          <Heading level={4}>Contact</Heading>
          <FormField label="Email" error={errors?.email}>
            <EmailInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              disabled={loading}
              accessibilityLabel="Email"
            />
          </FormField>
          <FormField label="Phone" error={errors?.phone}>
            <PhoneInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 555 000 0000"
              disabled={loading}
              accessibilityLabel="Phone number"
            />
          </FormField>
        </VStack>

        <VStack gap="md">
          <Heading level={4}>Shipping address</Heading>
          <AddressForm onChange={handleAddressChange} loading={loading} errors={addressErrors} />
        </VStack>

        {footer}

        <Button onPress={handleSubmit} loading={loading} fullWidth>
          {submitLabel}
        </Button>
      </VStack>
    );
  },
);

CheckoutFormImpl.displayName = 'CheckoutForm';

export const CheckoutForm = React.memo(CheckoutFormImpl);
