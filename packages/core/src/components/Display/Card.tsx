import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { CardContext, type CardContextValue } from '../../layout-intelligence/context';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface CardProps extends Omit<ViewProps, 'style'> {
  readonly variant?: 'elevated' | 'outlined' | 'filled';
  readonly density?: 'compact' | 'comfortable' | 'spacious';
  readonly interactive?: boolean;
  readonly onPress?: () => void;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

const CardImpl = React.forwardRef<View, CardProps>(function Card(props, ref) {
  const {
    variant = 'elevated',
    density = 'comfortable',
    interactive = false,
    onPress,
    children,
    style,
    ...rest
  } = props;
  const tokens = useTokens();
  const ctx: CardContextValue = { variant, density, interactive };
  const padding =
    density === 'compact'
      ? tokens.space.sm
      : density === 'spacious'
        ? tokens.space.xl
        : tokens.space.md;
  const cardStyle: ViewStyle = {
    padding,
    borderRadius: tokens.radii.lg,
    backgroundColor:
      variant === 'filled' ? tokens.colors.background.subtle : tokens.colors.background.elevated,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: tokens.colors.border.default,
    ...(variant === 'elevated' ? resolveShadow('md') : {}),
  };
  const node =
    onPress || interactive ? (
      <Pressable
        ref={ref}
        onPress={onPress}
        accessibilityRole="button"
        style={[cardStyle, style]}
        {...rest}
      >
        {children}
      </Pressable>
    ) : (
      <View ref={ref} style={[cardStyle, style]} {...rest}>
        {children}
      </View>
    );
  return <CardContext.Provider value={ctx}>{node}</CardContext.Provider>;
});

CardImpl.displayName = 'Card';

export const Card = tagComponent(CardImpl, 'Card');
