import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface MindeesCameraProps {
  readonly facing?: 'front' | 'back';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [key: string]: any;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CameraPeer = React.ComponentType<any>;

const CameraImpl = React.forwardRef<View, MindeesCameraProps>(function Camera(props, _ref) {
  const Peer = tryLoadPeer<CameraPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-camera') as { CameraView: CameraPeer };
    return mod.CameraView;
  });
  if (!Peer) {
    return (
      <MissingPeer
        peer="expo-camera"
        install="pnpm add expo-camera"
        label="Camera requires expo-camera"
      />
    );
  }
  return <Peer {...props} />;
});

CameraImpl.displayName = 'Camera';

export const Camera = tagComponent(CameraImpl, 'Camera');
