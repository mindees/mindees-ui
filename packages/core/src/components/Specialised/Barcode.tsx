import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Camera } from './Camera';

export interface BarcodeScanResult {
  readonly type: string;
  readonly data: string;
}

export interface BarcodeProps {
  readonly onScanned: (result: BarcodeScanResult) => void;
  /** Restrict scanning to specific symbologies. */
  readonly types?: readonly (
    | 'qr'
    | 'ean13'
    | 'ean8'
    | 'code128'
    | 'code39'
    | 'upc_a'
    | 'upc_e'
    | 'pdf417'
    | 'datamatrix'
  )[];
  readonly [key: string]: unknown;
}

/**
 * Barcode / QR scanner built on the `Camera` wrapper. Routes the underlying
 * `onBarcodeScanned` event into a strongly-typed callback. Requires
 * `expo-camera` (gated via `Camera`).
 */
const BarcodeImpl = React.forwardRef<View, BarcodeProps>(function Barcode(props, _ref) {
  const { onScanned, types, ...rest } = props;
  // `forwardRef`'s prop mapping collapses explicit members of an interface with a
  // string index signature down to that signature's `unknown`, so re-narrow the
  // first-party callback to its declared type at this single internal call site.
  const onScannedFn = onScanned as BarcodeProps['onScanned'];
  return (
    <Camera
      {...rest}
      barcodeScannerSettings={types ? { barcodeTypes: types as readonly string[] } : undefined}
      onBarcodeScanned={(event: BarcodeScanResult) => onScannedFn(event)}
    />
  );
});

BarcodeImpl.displayName = 'Barcode';

export const Barcode = tagComponent(BarcodeImpl, 'Barcode');
