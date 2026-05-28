import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface MindeesMapViewProps {
  readonly initialRegion?: {
    readonly latitude: number;
    readonly longitude: number;
    readonly latitudeDelta: number;
    readonly longitudeDelta: number;
  };
  readonly [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MapPeer = React.ComponentType<any>;

const MapViewImpl = React.forwardRef<View, MindeesMapViewProps>(function MapView(props, _ref) {
  const Peer = tryLoadPeer<MapPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-maps') as { default: MapPeer };
    return mod.default;
  });
  if (!Peer) {
    return (
      <MissingPeer
        peer="react-native-maps"
        install="pnpm add react-native-maps"
        label="MapView requires react-native-maps"
      />
    );
  }
  return <Peer {...props} />;
});

MapViewImpl.displayName = 'MapView';

export const MapView = tagComponent(MapViewImpl, 'MapView');
