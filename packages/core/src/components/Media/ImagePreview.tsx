import * as React from 'react';
import {
  ActivityIndicator,
  type ImageStyle,
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Image, type MindeesImageProps } from '../Display/Image';

export interface ImagePreviewProps extends Omit<MindeesImageProps, 'style'> {
  /** Invoked on tap — wire this to your zoom / lightbox flow. */
  readonly onPress?: () => void;
  /** Accessibility label describing the image. */
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
  /** Style forwarded to the inner image. */
  readonly imageStyle?: StyleProp<ImageStyle>;
}

/**
 * An image with a tap-to-zoom affordance and a loading placeholder. Composes
 * the existing `Image`; the spinner shows until the image reports `onLoadEnd`.
 */
const ImagePreviewImpl = React.forwardRef<View, ImagePreviewProps>(
  function ImagePreview(props, ref) {
    const { onPress, accessibilityLabel, style, imageStyle, onLoadStart, onLoadEnd, ...rest } =
      props;
    const tokens = useTokens();
    const [loading, setLoading] = React.useState(true);

    const handleLoadStart = React.useCallback(() => {
      setLoading(true);
      onLoadStart?.();
    }, [onLoadStart]);

    const handleLoadEnd = React.useCallback(() => {
      setLoading(false);
      onLoadEnd?.();
    }, [onLoadEnd]);

    const containerStyle = React.useMemo<ViewStyle>(
      () => ({
        position: 'relative',
        borderRadius: tokens.radii.md,
        overflow: 'hidden',
        backgroundColor: tokens.colors.background.subtle,
      }),
      [tokens],
    );

    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={!onPress}
        accessibilityRole={onPress ? 'imagebutton' : 'image'}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={onPress ? 'Activates to zoom the image' : undefined}
        style={[containerStyle, style]}
      >
        <Image
          {...rest}
          style={[StyleSheet.absoluteFill, imageStyle]}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
        />
        {loading ? (
          <View style={StyleSheet.absoluteFill} pointerEvents="none">
            <ActivityIndicator style={styles.spinner} color={tokens.colors.text.muted} />
          </View>
        ) : null}
      </Pressable>
    );
  },
);

const styles = StyleSheet.create({
  spinner: { flex: 1, alignSelf: 'center' },
});

ImagePreviewImpl.displayName = 'ImagePreview';

export const ImagePreview = tagComponent(React.memo(ImagePreviewImpl), 'ImagePreview');
