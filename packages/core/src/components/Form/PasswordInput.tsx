import * as React from 'react';
import { Pressable, type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

import { Input, type InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'secureTextEntry' | 'trailing'> {
  /** Initial visibility state. Defaults to hidden (true). */
  readonly defaultMasked?: boolean;
  /** Hide the visibility toggle button. */
  readonly hideToggle?: boolean;
}

const PasswordInputImpl = React.forwardRef<TextInput, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const { defaultMasked = true, hideToggle = false, ...rest } = props;
    const [masked, setMasked] = React.useState(defaultMasked);
    const tokens = useTokens();

    const toggle = hideToggle ? undefined : (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={masked ? 'Show password' : 'Hide password'}
        onPress={() => setMasked((v) => !v)}
        hitSlop={8}
        style={{ paddingHorizontal: tokens.space['2xs'] }}
      >
        <Text tone="muted">{masked ? 'Show' : 'Hide'}</Text>
      </Pressable>
    );

    return (
      <Input
        ref={ref}
        secureTextEntry={masked}
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        trailing={toggle}
        {...rest}
      />
    );
  },
);

PasswordInputImpl.displayName = 'PasswordInput';

export const PasswordInput = tagComponent(PasswordInputImpl, 'PasswordInput');
