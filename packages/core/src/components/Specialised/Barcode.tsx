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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [key: string]: any;
}

/**
 * Barcode / QR scanner built on the `Camera` wrapper. Routes the underlying
 * `onBarcodeScanned` event into a strongly-typed callback. Requires
 * `expo-camera` (gated via `Camera`).
 */
const BarcodeImpl = React.forwardRef<View, BarcodeProps>(function Barcode(props, _ref) {
  const { onScanned, types, ...rest } = props;
  return (
    <Camera
      {...rest}
      barcodeScannerSettings={types ? { barcodeTypes: types as readonly string[] } : undefined}
      onBarcodeScanned={(event: BarcodeScanResult) => onScanned(event)}
    />
  );
});

BarcodeImpl.displayName = 'Barcode';

export const Barcode = tagComponent(BarcodeImpl, 'Barcode');
