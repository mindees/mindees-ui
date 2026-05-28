import { ChevronLeftIcon } from '@mindees/icons';
import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { IconButton, type IconButtonProps } from './IconButton';

export interface BackButtonProps extends Omit<IconButtonProps, 'children' | 'accessibilityLabel'> {
  /** Screen-reader label. Defaults to "Back". */
  readonly accessibilityLabel?: string;
  /** Icon glyph size in dp. Defaults to a size matched to the button. */
  readonly iconSize?: number;
}

const ICON_SIZE: Record<NonNullable<IconButtonProps['size']>, number> = {
  sm: 18,
  md: 22,
  lg: 26,
};

const BackButtonImpl = React.forwardRef<View, BackButtonProps>(function BackButton(props, ref) {
  const { size = 'md', tone = 'neutral', accessibilityLabel = 'Back', iconSize, ...rest } = props;
  const tokens = useTokens();
  const color =
    tone === 'primary'
      ? tokens.colors.action.primary
      : tone === 'danger'
        ? tokens.colors.status.danger
        : tokens.colors.text.primary;

  return (
    <IconButton ref={ref} size={size} tone={tone} accessibilityLabel={accessibilityLabel} {...rest}>
      <ChevronLeftIcon size={iconSize ?? ICON_SIZE[size]} color={color} />
    </IconButton>
  );
});

BackButtonImpl.displayName = 'BackButton';

export const BackButton = tagComponent(React.memo(BackButtonImpl), 'BackButton');
