import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface SignaturePadProps {
  readonly onSign?: (signatureDataUri: string) => void;
  readonly onClear?: () => void;
  readonly [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SigPeer = React.ComponentType<any>;

const SignaturePadImpl = React.forwardRef<View, SignaturePadProps>(
  function SignaturePad(props, _ref) {
    const Peer = tryLoadPeer<SigPeer>(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require('react-native-signature-canvas') as { default: SigPeer };
      return mod.default;
    });
    if (!Peer) {
      return (
        <MissingPeer
          peer="react-native-signature-canvas"
          install="pnpm add react-native-signature-canvas"
          label="SignaturePad requires react-native-signature-canvas"
        />
      );
    }
    const { onSign, onClear, ...rest } = props;
    return <Peer onOK={onSign} onClear={onClear} {...rest} />;
  },
);

SignaturePadImpl.displayName = 'SignaturePad';

export const SignaturePad = tagComponent(SignaturePadImpl, 'SignaturePad');
