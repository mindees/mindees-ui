import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { OTPInput, type OTPInputProps } from './OTPInput';

export type PINInputProps = Omit<OTPInputProps, 'secureTextEntry'>;

const DEFAULT_PIN_LENGTH = 4;

const PINInputImpl = React.forwardRef<View, PINInputProps>(function PINInput(props, ref) {
  const { length = DEFAULT_PIN_LENGTH, ...rest } = props;
  return <OTPInput ref={ref} length={length} secureTextEntry {...rest} />;
});

PINInputImpl.displayName = 'PINInput';

export const PINInput = tagComponent(PINInputImpl, 'PINInput');
