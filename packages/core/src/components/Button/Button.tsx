import * as React from 'react';
import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
  type View,
  type ViewStyle,
} from 'react-native';

import {
  ButtonGroupContext,
  type ButtonGroupContextValue,
} from '../../layout-intelligence/context';
import { Slot, type AsChildProps } from '../../layout-intelligence/Slot';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonTone = 'primary' | 'neutral' | 'success' | 'danger' | 'warning';

export interface ButtonOwnProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly tone?: ButtonTone;
  readonly loading?: boolean;
  readonly disabled?: boolean;
  readonly fullWidth?: boolean;
  /** Slot rendered before the label. */
  readonly leading?: React.ReactNode;
  /** Slot rendered after the label. */
  readonly trailing?: React.ReactNode;
  readonly children?: React.ReactNode;
}

export type ButtonProps = AsChildProps<ButtonOwnProps & Omit<PressableProps, 'children'>>;

const SIZE_MAP: Record<ButtonSize, { height: number; padX: number; fontSize: number }> = {
  sm: { height: 36, padX: 12, fontSize: 14 },
  md: { height: 44, padX: 16, fontSize: 16 },
  lg: { height: 52, padX: 20, fontSize: 18 },
};

interface ResolvedTone {
  readonly bg: string;
  readonly bgPressed: string;
  readonly border: string;
  readonly text: string;
}

function toneColors(
  tokens: ReturnType<typeof useTokens>,
  tone: ButtonTone,
  variant: ButtonVariant,
): ResolvedTone {
  const accent =
    tone === 'primary'
      ? tokens.colors.action.primary
      : tone === 'success'
        ? tokens.colors.status.success
        : tone === 'danger'
          ? tokens.colors.status.danger
          : tone === 'warning'
            ? tokens.colors.status.warning
            : tokens.colors.action.secondary;
  if (variant === 'solid') {
    return {
      bg: accent,
      bgPressed: tone === 'primary' ? tokens.colors.action.primaryHover : accent,
      border: accent,
      text: tone === 'neutral' ? tokens.colors.text.primary : tokens.colors.text.onAccent,
    };
  }
  if (variant === 'outline') {
    return {
      bg: 'transparent',
      bgPressed: tokens.colors.background.subtle,
      border: accent,
      text: accent,
    };
  }
  if (variant === 'ghost') {
    return {
      bg: 'transparent',
      bgPressed: tokens.colors.background.subtle,
      border: 'transparent',
      text: accent,
    };
  }
  // link
  return {
    bg: 'transparent',
    bgPressed: 'transparent',
    border: 'transparent',
    text: accent,
  };
}

function ButtonImpl(props: ButtonProps, ref: React.Ref<View>): React.ReactElement {
  const groupCtx = React.useContext(ButtonGroupContext);
  const {
    asChild = false,
    variant: variantProp,
    size: sizeProp,
    tone: toneProp,
    loading = false,
    disabled: disabledProp,
    fullWidth = false,
    leading,
    trailing,
    children,
    style,
    onPress,
    ...rest
  } = props;
  const variant = variantProp ?? groupCtx?.variant ?? 'solid';
  const size = sizeProp ?? groupCtx?.size ?? 'md';
  const tone = toneProp ?? 'primary';
  const disabled = disabledProp ?? loading;
  const tokens = useTokens();
  const colors = toneColors(tokens, tone, variant);
  const sizing = SIZE_MAP[size];

  // Group-aware corner merging.
  const radii = groupCtx
    ? mergedCornerRadii(groupCtx, tokens.radii.md)
    : { borderRadius: tokens.radii.md };

  const containerStyleBase: ViewStyle = {
    minHeight: sizing.height,
    paddingHorizontal: sizing.padX,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.space['2xs'],
    borderWidth: variant === 'outline' ? 1 : 0,
    borderColor: colors.border,
    backgroundColor: colors.bg,
    opacity: disabled ? 0.5 : 1,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    ...radii,
  };

  if (asChild) {
    return (
      <Slot
        ref={ref}
        style={[containerStyleBase, style]}
        accessibilityRole="button"
        accessibilityState={{ disabled, busy: loading }}
        onPress={disabled ? undefined : onPress}
        {...rest}
      >
        {children as React.ReactElement}
      </Slot>
    );
  }

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={({ pressed }) => [
        containerStyleBase,
        pressed && !disabled ? { backgroundColor: colors.bgPressed } : undefined,
        style as ViewStyle,
      ]}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.text} />
      ) : (
        <>
          {leading}
          {typeof children === 'string' ? (
            <Text
              variant={size === 'lg' ? 'bodyLg' : size === 'sm' ? 'bodySm' : 'body'}
              weight="semibold"
              tone="primary"
              style={{ color: colors.text }}
            >
              {children}
            </Text>
          ) : (
            children
          )}
          {trailing}
        </>
      )}
    </Pressable>
  );
}

function mergedCornerRadii(
  ctx: ButtonGroupContextValue,
  baseRadius: number,
): Pick<
  ViewStyle,
  | 'borderTopLeftRadius'
  | 'borderTopRightRadius'
  | 'borderBottomLeftRadius'
  | 'borderBottomRightRadius'
> {
  if (!ctx.attached)
    return {
      borderTopLeftRadius: baseRadius,
      borderTopRightRadius: baseRadius,
      borderBottomLeftRadius: baseRadius,
      borderBottomRightRadius: baseRadius,
    };
  const isRow = ctx.orientation === 'horizontal';
  return {
    borderTopLeftRadius: isRow
      ? ctx.position.isFirst
        ? baseRadius
        : 0
      : ctx.position.isFirst
        ? baseRadius
        : 0,
    borderBottomLeftRadius: isRow
      ? ctx.position.isFirst
        ? baseRadius
        : 0
      : ctx.position.isLast
        ? baseRadius
        : 0,
    borderTopRightRadius: isRow
      ? ctx.position.isLast
        ? baseRadius
        : 0
      : ctx.position.isFirst
        ? baseRadius
        : 0,
    borderBottomRightRadius: isRow
      ? ctx.position.isLast
        ? baseRadius
        : 0
      : ctx.position.isLast
        ? baseRadius
        : 0,
  };
}

const ButtonComponent = React.forwardRef<View, ButtonProps>(ButtonImpl);
ButtonComponent.displayName = 'Button';

export const Button = tagComponent(ButtonComponent, 'Button');
