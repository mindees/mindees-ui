import * as React from 'react';
import { ActivityIndicator, type ActivityIndicatorProps, type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface SpinnerProps extends Omit<ActivityIndicatorProps, 'color' | 'size'> {
  readonly size?: 'sm' | 'md' | 'lg';
  readonly tone?: 'primary' | 'inverse' | 'muted';
}

const SIZE_MAP: Record<NonNullable<SpinnerProps['size']>, 'small' | 'large'> = {
  sm: 'small',
  md: 'small',
  lg: 'large',
};

const SpinnerImpl = React.forwardRef<View, SpinnerProps>(function Spinner(props, ref) {
  const { size = 'md', tone = 'primary', ...rest } = props;
  const tokens = useTokens();
  const color =
    tone === 'inverse'
      ? tokens.colors.text.inverse
      : tone === 'muted'
        ? tokens.colors.text.muted
        : tokens.colors.action.primary;
  return (
    <ActivityIndicator
      ref={ref}
      accessibilityLabel="Loading"
      size={SIZE_MAP[size]}
      color={color}
      {...rest}
    />
  );
});

SpinnerImpl.displayName = 'Spinner';

export const Spinner = tagComponent(SpinnerImpl, 'Spinner');
