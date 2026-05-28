import * as React from 'react';
import {
  type Image as RNImage,
  type LayoutChangeEvent,
  PixelRatio,
  type StyleProp,
  type ImageStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Image, type MindeesImageProps } from '../Display/Image';

/** A single candidate source with its intrinsic pixel width. */
export interface ResponsiveImageSource {
  readonly uri: string;
  readonly width: number;
}

export interface ResponsiveImageProps extends Omit<MindeesImageProps, 'src'> {
  /**
   * Candidate sources ordered or unordered by intrinsic width. The smallest
   * source whose width covers `container width * DPR` is chosen; if none is
   * large enough the widest candidate is used.
   */
  readonly sources?: readonly ResponsiveImageSource[];
  /** Fallback single URI when `sources` is absent or empty. */
  readonly uri?: string;
  readonly style?: StyleProp<ImageStyle>;
}

/**
 * Picks the most appropriate source for the rendered container width and the
 * device pixel ratio. Composes the existing `Image`, so it inherits its
 * gated-peer behaviour and prop surface.
 */
function pickSource(
  sources: readonly ResponsiveImageSource[],
  containerWidth: number,
): string | undefined {
  if (sources.length === 0) return undefined;
  const target = containerWidth * PixelRatio.get();
  // Smallest source that still covers the target, else the widest available.
  let best: ResponsiveImageSource | undefined;
  let widest: ResponsiveImageSource | undefined;
  for (const candidate of sources) {
    if (!widest || candidate.width > widest.width) widest = candidate;
    if (candidate.width >= target && (!best || candidate.width < best.width)) {
      best = candidate;
    }
  }
  return (best ?? widest)?.uri;
}

const ResponsiveImageImpl = React.forwardRef<RNImage, ResponsiveImageProps>(
  function ResponsiveImage(props, ref) {
    const { sources, uri, onLayout, ...rest } = props;
    const [containerWidth, setContainerWidth] = React.useState(0);

    const handleLayout = React.useCallback(
      (event: LayoutChangeEvent) => {
        const next = event.nativeEvent.layout.width;
        setContainerWidth((prev) => (prev === next ? prev : next));
        onLayout?.(event);
      },
      [onLayout],
    );

    const resolved = React.useMemo(() => {
      if (sources && sources.length > 0) {
        // Before first layout, default to the widest so the image is never
        // empty on the initial paint; refine once the container width is known.
        return pickSource(sources, containerWidth || Number.POSITIVE_INFINITY) ?? uri;
      }
      return uri;
    }, [sources, containerWidth, uri]);

    return <Image ref={ref} src={resolved} onLayout={handleLayout} {...rest} />;
  },
);

ResponsiveImageImpl.displayName = 'ResponsiveImage';

export const ResponsiveImage = tagComponent(React.memo(ResponsiveImageImpl), 'ResponsiveImage');
