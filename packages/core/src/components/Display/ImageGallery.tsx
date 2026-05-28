import * as React from 'react';
import {
  FlatList,
  Pressable,
  View,
  type ImageStyle,
  type ListRenderItemInfo,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { Image } from './Image';

export interface GalleryImage {
  readonly uri: string;
  readonly alt?: string;
}

export interface ImageGalleryProps extends Omit<ViewProps, 'style'> {
  readonly images: readonly GalleryImage[];
  /** Cells per row. Defaults to 3. */
  readonly columns?: number;
  /** Called when a cell is tapped. */
  readonly onPressImage?: (image: GalleryImage, index: number) => void;
  readonly style?: StyleProp<ViewStyle>;
}

const TILE_STYLE: ViewStyle = { flex: 1, aspectRatio: 1 };
const IMAGE_STYLE: ImageStyle = { width: '100%', height: '100%' };

function keyExtractor(item: GalleryImage, index: number): string {
  return `${item.uri}-${index}`;
}

const ImageGalleryImpl = React.forwardRef<View, ImageGalleryProps>(
  function ImageGallery(props, ref) {
    const { images, columns = 3, onPressImage, style, ...rest } = props;
    const tokens = useTokens();
    const gap = tokens.space['2xs'];
    const radius = tokens.radii.md;
    const surface = tokens.colors.background.subtle;

    const renderItem = React.useCallback(
      ({ item, index }: ListRenderItemInfo<GalleryImage>) => {
        const tileStyle: ViewStyle = {
          ...TILE_STYLE,
          margin: gap,
          borderRadius: radius,
          overflow: 'hidden',
          backgroundColor: surface,
        };
        const accessibilityLabel = item.alt ?? `Image ${index + 1}`;
        const inner = <Image src={item.uri} accessibilityLabel={item.alt} style={IMAGE_STYLE} />;
        if (onPressImage) {
          return (
            <Pressable
              accessibilityRole="imagebutton"
              accessibilityLabel={accessibilityLabel}
              onPress={() => onPressImage(item, index)}
              style={tileStyle}
            >
              {inner}
            </Pressable>
          );
        }
        return (
          <View accessibilityRole="image" accessibilityLabel={accessibilityLabel} style={tileStyle}>
            {inner}
          </View>
        );
      },
      [gap, radius, surface, onPressImage],
    );

    return (
      <FlatList
        ref={ref as React.Ref<FlatList<GalleryImage>>}
        data={images}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        numColumns={columns}
        scrollEnabled={false}
        accessibilityRole="list"
        style={style}
        {...rest}
      />
    );
  },
);

ImageGalleryImpl.displayName = 'ImageGallery';

export const ImageGallery = tagComponent(ImageGalleryImpl, 'ImageGallery');
