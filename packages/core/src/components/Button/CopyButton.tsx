import { CheckIcon } from '@mindees/icons';
import * as React from 'react';
import { Clipboard, type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Button, resolveButtonTextColor, type ButtonBaseProps } from './Button';

export interface CopyButtonProps extends Omit<ButtonBaseProps, 'children' | 'onPress'> {
  /** Text written to the clipboard when pressed. */
  readonly value: string;
  /** Label shown in the idle state. Defaults to "Copy". */
  readonly children?: React.ReactNode;
  /** Label shown briefly after a successful copy. Defaults to "Copied". */
  readonly copiedLabel?: string;
  /** How long (ms) the copied state stays visible. Defaults to 1500. */
  readonly copiedDuration?: number;
  /** Called after the value is written to the clipboard. */
  readonly onCopied?: () => void;
}

const CHECK_SIZE: Record<NonNullable<ButtonBaseProps['size']>, number> = {
  sm: 14,
  md: 16,
  lg: 18,
};

const CopyButtonImpl = React.forwardRef<View, CopyButtonProps>(function CopyButton(props, ref) {
  const {
    value,
    children = 'Copy',
    copiedLabel = 'Copied',
    copiedDuration = 1500,
    onCopied,
    leading,
    variant,
    tone,
    size = 'md',
    ...rest
  } = props;
  const tokens = useTokens();
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(
    () => () => {
      if (timer.current !== undefined) clearTimeout(timer.current);
    },
    [],
  );

  const handlePress = React.useCallback(() => {
    // Clipboard is deprecated in RN core and may be absent at runtime; guard it.
    if (Clipboard && typeof Clipboard.setString === 'function') {
      Clipboard.setString(value);
    }
    setCopied(true);
    if (onCopied) onCopied();
    if (timer.current !== undefined) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), copiedDuration);
  }, [value, onCopied, copiedDuration]);

  const checkColor = resolveButtonTextColor(tokens, variant ?? 'solid', tone ?? 'primary');

  return (
    <Button
      ref={ref}
      onPress={handlePress}
      variant={variant}
      tone={tone}
      size={size}
      leading={copied ? <CheckIcon size={CHECK_SIZE[size]} color={checkColor} /> : leading}
      {...rest}
    >
      {copied ? copiedLabel : children}
    </Button>
  );
});

CopyButtonImpl.displayName = 'CopyButton';

export const CopyButton = tagComponent(React.memo(CopyButtonImpl), 'CopyButton');
