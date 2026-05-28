import { CloseIcon } from '@mindees/icons';
import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { IconButton, type IconButtonProps } from './IconButton';

export interface CloseButtonProps extends Omit<IconButtonProps, 'children' | 'accessibilityLabel'> {
  /** Screen-reader label. Defaults to "Close". */
  readonly accessibilityLabel?: string;
  /** Icon glyph size in dp. Defaults to a size matched to the button. */
  readonly iconSize?: number;
}

const ICON_SIZE: Record<NonNullable<IconButtonProps['size']>, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const CloseButtonImpl = React.forwardRef<View, CloseButtonProps>(function CloseButton(props, ref) {
  const { size = 'md', tone = 'neutral', accessibilityLabel = 'Close', iconSize, ...rest } = props;
  const tokens = useTokens();
  const color =
    tone === 'primary'
      ? tokens.colors.action.primary
      : tone === 'danger'
        ? tokens.colors.status.danger
        : tokens.colors.text.primary;

  return (
    <IconButton ref={ref} size={size} tone={tone} accessibilityLabel={accessibilityLabel} {...rest}>
      <CloseIcon size={iconSize ?? ICON_SIZE[size]} color={color} />
    </IconButton>
  );
});

CloseButtonImpl.displayName = 'CloseButton';

export const CloseButton = tagComponent(React.memo(CloseButtonImpl), 'CloseButton');
