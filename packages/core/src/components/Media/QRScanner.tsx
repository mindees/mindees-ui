import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

export interface ScanResult {
  readonly type: string;
  readonly data: string;
}

export interface ScannerProps {
  /** Invoked once per detected code. */
  readonly onScanned: (result: ScanResult) => void;
  /** Symbologies to detect. QRScanner defaults to `['qr']`. */
  readonly barcodeTypes?: readonly string[];
  readonly [key: string]: unknown;
}

type CameraPeer = React.ComponentType<Record<string, unknown>>;

/**
 * Shared scanner implementation built on `expo-camera`'s `CameraView`. Routes
 * the native `onBarcodeScanned` event into a strongly-typed `onScanned`
 * callback. Both `QRScanner` and `BarcodeScanner` render this with different
 * default symbologies, so the gated-peer logic lives in one place.
 */
export const Scanner = React.forwardRef<View, ScannerProps>(function Scanner(props, _ref) {
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
        label="Scanner requires expo-camera"
      />
    );
  }
  const { onScanned, barcodeTypes, ...rest } = props;
  // `forwardRef`'s prop mapping collapses explicit members of an interface with
  // a string index signature down to that signature's `unknown`, so re-narrow
  // the first-party callback to its declared type at this single call site.
  const onScannedFn = onScanned as ScannerProps['onScanned'];
  return (
    <Peer
      {...rest}
      barcodeScannerSettings={barcodeTypes ? { barcodeTypes } : undefined}
      onBarcodeScanned={(event: ScanResult) => onScannedFn(event)}
    />
  );
});

Scanner.displayName = 'Scanner';

// `ScannerProps` already carries the pass-through index signature, so omitting
// `barcodeTypes` is all that distinguishes the QR variant's public surface.
export type QRScannerProps = Omit<ScannerProps, 'barcodeTypes'>;

const QRScannerImpl = React.forwardRef<View, QRScannerProps>(function QRScanner(props, ref) {
  return <Scanner ref={ref} barcodeTypes={['qr']} {...props} />;
});

QRScannerImpl.displayName = 'QRScanner';

export const QRScanner = tagComponent(React.memo(QRScannerImpl), 'QRScanner');
