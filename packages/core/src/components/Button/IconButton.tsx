import * as React from 'react';
import { Pressable, type PressableProps, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface IconButtonProps extends Omit<PressableProps, 'children'> {
  readonly variant?: 'solid' | 'outline' | 'ghost';
  readonly size?: 'sm' | 'md' | 'lg';
  readonly tone?: 'primary' | 'neutral' | 'danger';
  readonly disabled?: boolean;
  readonly children: React.ReactElement;
  /** Required for screen readers. */
  readonly accessibilityLabel: string;
}

const SIZE_MAP: Record<NonNullable<IconButtonProps['size']>, number> = {
  sm: 32,
  md: 40,
  lg: 48,
};

const IconButtonImpl = React.forwardRef<View, IconButtonProps>(function IconButton(props, ref) {
  const {
    variant = 'ghost',
    size = 'md',
    tone = 'neutral',
    disabled = false,
    children,
    accessibilityLabel,
    style,
    ...rest
  } = props;
  const tokens = useTokens();
  const dim = SIZE_MAP[size];
  const accent =
    tone === 'primary'
      ? tokens.colors.action.primary
      : tone === 'danger'
        ? tokens.colors.status.danger
        : tokens.colors.text.primary;

  const baseStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:
      variant === 'solid' ? accent : variant === 'outline' ? 'transparent' : 'transparent',
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: accent,
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      hitSlop={8}
      style={({ pressed }) => [
        baseStyle,
        pressed && !disabled ? { backgroundColor: tokens.colors.background.subtle } : undefined,
        style as ViewStyle,
      ]}
      {...rest}
    >
      {children}
    </Pressable>
  );
});

IconButtonImpl.displayName = 'IconButton';

export const IconButton = tagComponent(IconButtonImpl, 'IconButton');
