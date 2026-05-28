import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

export interface LottieViewProps {
  /** Animation source: a required JSON module, a `{ uri }`, or a raw object. */
  readonly source: unknown;
  /** Start playing as soon as it mounts. Defaults to true. */
  readonly autoPlay?: boolean;
  /** Loop the animation. Defaults to true. */
  readonly loop?: boolean;
  readonly [key: string]: unknown;
}

type LottiePeer = React.ComponentType<Record<string, unknown>>;

const LottieViewImpl = React.forwardRef<View, LottieViewProps>(function LottieView(props, _ref) {
  const Peer = tryLoadPeer<LottiePeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('lottie-react-native') as { default: LottiePeer };
    return mod.default;
  });
  if (!Peer) {
    return (
      <MissingPeer
        peer="lottie-react-native"
        install="pnpm add lottie-react-native"
        label="LottieView requires lottie-react-native"
      />
    );
  }
  const { source, autoPlay = true, loop = true, ...rest } = props;
  return <Peer source={source} autoPlay={autoPlay} loop={loop} {...rest} />;
});

LottieViewImpl.displayName = 'LottieView';

export const LottieView = tagComponent(React.memo(LottieViewImpl), 'LottieView');
