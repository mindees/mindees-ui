import * as React from 'react';
import { type TextInput } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Input, type InputProps } from './Input';

export interface TextareaProps extends Omit<InputProps, 'multiline'> {
  /** Number of visible text lines. Defaults to 4. */
  readonly rows?: number;
}

const TextareaImpl = React.forwardRef<TextInput, TextareaProps>(function Textarea(props, ref) {
  const { rows = 4, numberOfLines, ...rest } = props;
  return (
    <Input
      ref={ref}
      multiline
      numberOfLines={numberOfLines ?? rows}
      textAlignVertical="top"
      {...rest}
    />
  );
});

TextareaImpl.displayName = 'Textarea';

export const Textarea = tagComponent(TextareaImpl, 'Textarea');
