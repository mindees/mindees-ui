import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Button, type ButtonBaseProps } from './Button';
import { GlyphAffordance } from './internal/GlyphAffordance';

export interface RetryButtonProps extends Omit<ButtonBaseProps, 'children' | 'onPress'> {
  /** Invoked when the button is pressed. */
  readonly onRetry?: () => void;
  /** Label text. Defaults to "Retry". */
  readonly children?: React.ReactNode;
}

const RetryButtonImpl = React.forwardRef<View, RetryButtonProps>(function RetryButton(props, ref) {
  const { onRetry, children = 'Retry', leading, variant, tone, size, ...rest } = props;
  return (
    <Button
      ref={ref}
      onPress={onRetry}
      variant={variant}
      tone={tone}
      size={size}
      leading={leading ?? <GlyphAffordance glyph="↻" variant={variant} tone={tone} size={size} />}
      {...rest}
    >
      {children}
    </Button>
  );
});

RetryButtonImpl.displayName = 'RetryButton';

export const RetryButton = tagComponent(React.memo(RetryButtonImpl), 'RetryButton');
