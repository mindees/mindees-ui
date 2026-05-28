import * as React from 'react';
import {
  type ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
  View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Image } from '../Display/Image';
import { Text } from '../Text/Text';

export interface LogoProps {
  /** Image source (URL string or RN source). When present it wins over `label`. */
  readonly source?: string | ImageSourcePropType;
  /** Text wordmark used when no `source` is given. */
  readonly label?: string;
  /** Logical height of the mark in points. Defaults to 32. */
  readonly height?: number;
  /** Accessibility label; defaults to `label` or a generic "Logo". */
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly imageStyle?: StyleProp<ImageStyle>;
}

const DEFAULT_HEIGHT = 32;

/**
 * Renders a brand mark as an image when `source` is provided, otherwise as a
 * text wordmark. Composes the existing `Image` and `Text`.
 */
const LogoImpl = React.forwardRef<View, LogoProps>(function Logo(props, ref) {
  const {
    source,
    label,
    height = DEFAULT_HEIGHT,
    accessibilityLabel,
    style,
    imageStyle,
    ...rest
  } = props;

  const a11yLabel = accessibilityLabel ?? label ?? 'Logo';

  const containerStyle = React.useMemo<ViewStyle>(
    () => ({ height, justifyContent: 'center', alignSelf: 'flex-start' }),
    [height],
  );

  const resolvedImageStyle = React.useMemo<ImageStyle>(
    // Width auto-derives from the source's aspect ratio; height is authoritative.
    () => ({ height, width: undefined, resizeMode: 'contain' }),
    [height],
  );

  return (
    <View
      ref={ref}
      accessibilityRole="image"
      accessibilityLabel={a11yLabel}
      style={[containerStyle, style]}
      {...rest}
    >
      {source ? (
        <Image src={source} style={[resolvedImageStyle, imageStyle]} accessible={false} />
      ) : (
        <Text variant="h4" weight="bold" numberOfLines={1}>
          {label ?? ''}
        </Text>
      )}
    </View>
  );
});

LogoImpl.displayName = 'Logo';

export const Logo = tagComponent(React.memo(LogoImpl), 'Logo');
