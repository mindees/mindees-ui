import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface QRCodeProps {
  readonly value: string;
  readonly size?: number;
  readonly color?: string;
  readonly backgroundColor?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QRCodePeer = React.ComponentType<any>;

const QRCodeImpl = React.forwardRef<View, QRCodeProps>(function QRCode(props, _ref) {
  const tokens = useTokens();
  const QRPeer = tryLoadPeer<QRCodePeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-qrcode-svg') as { default: QRCodePeer };
    return mod.default;
  });
  if (!QRPeer) {
    return (
      <MissingPeer
        peer="react-native-qrcode-svg"
        install="pnpm add react-native-qrcode-svg"
        label="QRCode requires react-native-qrcode-svg"
      />
    );
  }
  return (
    <QRPeer
      value={props.value}
      size={props.size ?? 200}
      color={props.color ?? tokens.colors.text.primary}
      backgroundColor={props.backgroundColor ?? tokens.colors.background.canvas}
    />
  );
});

QRCodeImpl.displayName = 'QRCode';

export const QRCode = tagComponent(QRCodeImpl, 'QRCode');
