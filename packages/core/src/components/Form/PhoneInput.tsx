import * as React from 'react';
import { type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Input, type InputProps } from './Input';

export type PhoneInputProps = InputProps;

const PhoneInputImpl = React.forwardRef<TextInput, PhoneInputProps>(
  function PhoneInput(props, ref) {
    return (
      <Input
        ref={ref}
        keyboardType="phone-pad"
        autoComplete="tel"
        textContentType="telephoneNumber"
        {...props}
      />
    );
  },
);

PhoneInputImpl.displayName = 'PhoneInput';

export const PhoneInput = tagComponent(PhoneInputImpl, 'PhoneInput');
