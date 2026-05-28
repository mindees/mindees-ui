import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import { Pressable, type PressableProps, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface FABProps extends Omit<PressableProps, 'children'> {
  readonly size?: 'md' | 'lg';
  readonly tone?: 'primary' | 'neutral';
  readonly disabled?: boolean;
  readonly children: React.ReactElement;
  /** Required for screen readers. */
  readonly accessibilityLabel: string;
}

const SIZES: Record<NonNullable<FABProps['size']>, number> = { md: 56, lg: 72 };

const FABImpl = React.forwardRef<View, FABProps>(function FAB(props, ref) {
  const {
    size = 'md',
    tone = 'primary',
    disabled = false,
    children,
    style,
    accessibilityLabel,
    ...rest
  } = props;
  const tokens = useTokens();
  const dim = SIZES[size];
  const bg = tone === 'primary' ? tokens.colors.action.primary : tokens.colors.background.elevated;

  const baseStyle: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: dim / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: bg,
    opacity: disabled ? 0.5 : 1,
    ...resolveShadow('lg'),
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={[baseStyle, style as ViewStyle]}
      {...rest}
    >
      {children}
    </Pressable>
  );
});

FABImpl.displayName = 'FAB';

export const FAB = tagComponent(FABImpl, 'FAB');
