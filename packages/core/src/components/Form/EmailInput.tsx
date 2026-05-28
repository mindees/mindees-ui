import * as React from 'react';
import { type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Input, type InputProps } from './Input';

export type EmailInputProps = InputProps;

const EmailInputImpl = React.forwardRef<TextInput, EmailInputProps>(
  function EmailInput(props, ref) {
    return (
      <Input
        ref={ref}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        {...props}
      />
    );
  },
);

EmailInputImpl.displayName = 'EmailInput';

export const EmailInput = tagComponent(EmailInputImpl, 'EmailInput');
