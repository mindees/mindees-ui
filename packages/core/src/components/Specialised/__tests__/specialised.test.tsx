import { render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { Barcode } from '../Barcode';
import { Camera } from '../Camera';
import { CodeBlock } from '../CodeBlock';
import { ColorPicker } from '../ColorPicker';
import { MapView } from '../MapView';
import { QRCode } from '../QRCode';
import { SignaturePad } from '../SignaturePad';
import { WebView } from '../WebView';

describe('Phase 6 — tag identity + gated peers', () => {
  it('every specialised primitive carries its tag', () => {
    expect(getComponentTag(<CodeBlock code="x" />)).toBe('CodeBlock');
    expect(getComponentTag(<QRCode value="x" />)).toBe('QRCode');
    expect(getComponentTag(<Barcode onScanned={() => undefined} />)).toBe('Barcode');
    expect(getComponentTag(<MapView />)).toBe('MapView');
    expect(getComponentTag(<ColorPicker />)).toBe('ColorPicker');
    expect(getComponentTag(<SignaturePad />)).toBe('SignaturePad');
    expect(getComponentTag(<WebView source={{ uri: 'https://example.com' }} />)).toBe('WebView');
    expect(getComponentTag(<Camera />)).toBe('Camera');
  });

  it('CodeBlock renders without any peer dep', () => {
    const { getByText } = render(<CodeBlock code="const x = 1;" />);
    expect(getByText('const x = 1;')).toBeTruthy();
  });

  it('Missing-peer wrappers render an actionable fallback when the peer is absent', () => {
    // None of these peers are installed in the workspace, so each wrapper
    // should render the MissingPeer fallback rather than crashing. The peer
    // name appears in both the label and the install instruction, so use
    // getAllByText to assert at least one match.
    expect(
      render(<QRCode value="x" />).getAllByText(/react-native-qrcode-svg/).length,
    ).toBeGreaterThan(0);
    expect(
      render(<WebView source={{ uri: 'https://example.com' }} />).getAllByText(
        /react-native-webview/,
      ).length,
    ).toBeGreaterThan(0);
    expect(render(<MapView />).getAllByText(/react-native-maps/).length).toBeGreaterThan(0);
    expect(render(<Camera />).getAllByText(/expo-camera/).length).toBeGreaterThan(0);
  });
});
