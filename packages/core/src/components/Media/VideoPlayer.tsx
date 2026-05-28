import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

export interface VideoPlayerProps {
  /** Remote or local URI of the video to play. */
  readonly source: { readonly uri: string } | string;
  /** Show native playback controls. Defaults to true. */
  readonly controls?: boolean;
  readonly [key: string]: unknown;
}

type VideoPeer = React.ComponentType<Record<string, unknown>>;

const VideoPlayerImpl = React.forwardRef<View, VideoPlayerProps>(function VideoPlayer(props, _ref) {
  // Prefer the modern `expo-video`; fall back to the legacy `expo-av` Video.
  const Peer = tryLoadPeer<VideoPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-video') as { VideoView: VideoPeer };
    return mod.VideoView;
  });
  const Legacy = tryLoadPeer<VideoPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-av') as { Video: VideoPeer };
    return mod.Video;
  });
  const Resolved = Peer ?? Legacy;
  if (!Resolved) {
    return (
      <MissingPeer
        peer="expo-video"
        install="pnpm add expo-video"
        label="VideoPlayer requires expo-video (or expo-av)"
      />
    );
  }
  const { source, controls = true, ...rest } = props;
  // The interface's string index signature collapses explicit members to
  // `unknown` through forwardRef, so re-narrow `source` at this call site.
  const src = source as VideoPlayerProps['source'];
  const uri = typeof src === 'string' ? src : src.uri;
  return (
    <Resolved source={{ uri }} useNativeControls={controls} nativeControls={controls} {...rest} />
  );
});

VideoPlayerImpl.displayName = 'VideoPlayer';

export const VideoPlayer = tagComponent(React.memo(VideoPlayerImpl), 'VideoPlayer');
