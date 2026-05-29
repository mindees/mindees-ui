import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface QRCodeProps {
  readonly value: string;
  readonly size?: number;
  readonly color?: string;
  readonly backgroundColor?: string;
  /** Style applied to the wrapping container (caller-last, overrides). */
  readonly style?: StyleProp<ViewStyle>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type QRCodePeer = React.ComponentType<any>;

const QRCodeImpl = React.forwardRef<View, QRCodeProps>(function QRCode(props, ref) {
  const { value, size, color, backgroundColor, style } = props;
  const tokens = useTokens();
  const QRPeer = tryLoadPeer<QRCodePeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-qrcode-svg') as { default: QRCodePeer };
    return mod.default;
  });
  return (
    <View ref={ref} style={style}>
      {QRPeer ? (
        <QRPeer
          value={value}
          size={size ?? 200}
          color={color ?? tokens.colors.text.primary}
          backgroundColor={backgroundColor ?? tokens.colors.background.canvas}
        />
      ) : (
        <MissingPeer
          peer="react-native-qrcode-svg"
          install="pnpm add react-native-qrcode-svg"
          label="QRCode requires react-native-qrcode-svg"
        />
      )}
    </View>
  );
});

QRCodeImpl.displayName = 'QRCode';

export const QRCode = tagComponent(QRCodeImpl, 'QRCode');
