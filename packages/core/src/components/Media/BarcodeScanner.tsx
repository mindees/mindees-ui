import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Scanner, type ScannerProps } from './QRScanner';

// `ScannerProps` already carries the pass-through index signature.
export type BarcodeScannerProps = ScannerProps;

const DEFAULT_TYPES: readonly string[] = [
  'ean13',
  'ean8',
  'code128',
  'code39',
  'upc_a',
  'upc_e',
  'pdf417',
  'datamatrix',
  'qr',
];

/**
 * 1D/2D barcode scanner. Shares the gated `Scanner` implementation with
 * `QRScanner` but defaults to the full set of common symbologies.
 */
const BarcodeScannerImpl = React.forwardRef<View, BarcodeScannerProps>(
  function BarcodeScanner(props, ref) {
    const { barcodeTypes, ...rest } = props;
    return <Scanner ref={ref} barcodeTypes={barcodeTypes ?? DEFAULT_TYPES} {...rest} />;
  },
);

BarcodeScannerImpl.displayName = 'BarcodeScanner';

export const BarcodeScanner = tagComponent(React.memo(BarcodeScannerImpl), 'BarcodeScanner');
