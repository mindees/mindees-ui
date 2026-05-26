import * as React from 'react';
import {
  Image as RNImage,
  type ImageProps as RNImageProps,
  type ImageSourcePropType,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

export interface MindeesImageProps extends Omit<RNImageProps, 'source' | 'src'> {
  /** URL string or RN ImageSourcePropType. */
  readonly src?: string | ImageSourcePropType;
}

const ImageImpl = React.forwardRef<RNImage, MindeesImageProps>(function Image(props, ref) {
  const { src, ...rest } = props;
  // `expo-image` is an optional gated peer — if Phase 6 wires it up later,
  // this component will prefer it for perf. For now we ship RN's Image.
  const source =
    typeof src === 'string'
      ? { uri: src }
      : ((src as ImageSourcePropType | undefined) ?? { uri: '' });
  return <RNImage ref={ref} source={source} {...rest} />;
});

ImageImpl.displayName = 'Image';

export const Image = tagComponent(ImageImpl, 'Image');
