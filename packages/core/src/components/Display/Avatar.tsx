import * as React from 'react';
import {
  Image as RNImage,
  View,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<ViewProps, 'style'> {
  /** Image source URL or RN ImageSourcePropType. */
  readonly src?: string | { uri: string };
  /** Two-letter fallback rendered when no src or src fails. */
  readonly initials?: string;
  readonly name?: string;
  readonly size?: AvatarSize;
  readonly shape?: 'circle' | 'square';
  readonly style?: StyleProp<ViewStyle>;
}

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

function deriveInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

const AvatarImpl = React.forwardRef<View, AvatarProps>(function Avatar(props, ref) {
  const { src, initials, name, size = 'md', shape = 'circle', style, ...rest } = props;
  const tokens = useTokens();
  const dim = SIZE_MAP[size];
  const radius = shape === 'circle' ? dim / 2 : tokens.radii.md;
  const text = initials ?? (name ? deriveInitials(name) : '?');
  const wrap: ViewStyle = {
    width: dim,
    height: dim,
    borderRadius: radius,
    backgroundColor: tokens.colors.background.subtle,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  };
  const source = typeof src === 'string' ? { uri: src } : src;
  return (
    <View
      ref={ref}
      accessibilityRole="image"
      accessibilityLabel={name ?? 'Avatar'}
      style={[wrap, style]}
      {...rest}
    >
      {source ? (
        <RNImage source={source} style={{ width: dim, height: dim }} />
      ) : (
        <Text weight="semibold" tone="secondary">
          {text}
        </Text>
      )}
    </View>
  );
});

AvatarImpl.displayName = 'Avatar';

export const Avatar = tagComponent(AvatarImpl, 'Avatar');

// ---- AvatarGroup ------------------------------------------------------
export interface AvatarGroupProps extends Omit<ViewProps, 'style' | 'children'> {
  readonly max?: number;
  readonly children: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

const AvatarGroupImpl = React.forwardRef<View, AvatarGroupProps>(function AvatarGroup(props, ref) {
  const { max = 4, children, style, ...rest } = props;
  const tokens = useTokens();
  const arr = React.Children.toArray(children);
  const shown = arr.slice(0, max);
  const extra = arr.length - shown.length;

  return (
    <View
      ref={ref}
      accessibilityRole="none"
      style={[{ flexDirection: 'row', marginLeft: -tokens.space['2xs'] }, style]}
      {...rest}
    >
      {shown.map((child, i) => (
        <View key={i} style={{ marginLeft: -tokens.space['2xs'] }}>
          {child}
        </View>
      ))}
      {extra > 0 ? (
        <View
          style={{
            marginLeft: -tokens.space['2xs'],
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: tokens.colors.background.subtle,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text variant="caption" weight="semibold" tone="secondary">
            +{extra}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

AvatarGroupImpl.displayName = 'AvatarGroup';

export const AvatarGroup = tagComponent(AvatarGroupImpl, 'AvatarGroup');
