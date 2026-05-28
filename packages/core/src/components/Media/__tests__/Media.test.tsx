import { render } from '@testing-library/react-native';

import { getComponentTag } from '../../../layout-intelligence/tagged-component';
import { AudioPlayer } from '../AudioPlayer';
import { BarcodeScanner } from '../BarcodeScanner';
import { FilePreview } from '../FilePreview';
import { ImagePreview } from '../ImagePreview';
import { Logo } from '../Logo';
import { LottieView } from '../LottieView';
import { PDFViewer } from '../PDFViewer';
import { QRScanner } from '../QRScanner';
import { ResponsiveImage } from '../ResponsiveImage';
import { VideoPlayer } from '../VideoPlayer';

const noop = () => undefined;

describe('Media — tag identity', () => {
  it('every media primitive carries its tag', () => {
    expect(getComponentTag(<ResponsiveImage uri="https://example.com/a.png" />)).toBe(
      'ResponsiveImage',
    );
    expect(getComponentTag(<ImagePreview src="https://example.com/a.png" />)).toBe('ImagePreview');
    expect(getComponentTag(<FilePreview name="report.pdf" />)).toBe('FilePreview');
    expect(getComponentTag(<Logo label="Acme" />)).toBe('Logo');
    expect(getComponentTag(<VideoPlayer source={{ uri: 'https://example.com/v.mp4' }} />)).toBe(
      'VideoPlayer',
    );
    expect(getComponentTag(<AudioPlayer source={{ uri: 'https://example.com/a.mp3' }} />)).toBe(
      'AudioPlayer',
    );
    expect(getComponentTag(<PDFViewer source={{ uri: 'https://example.com/d.pdf' }} />)).toBe(
      'PDFViewer',
    );
    expect(getComponentTag(<QRScanner onScanned={noop} />)).toBe('QRScanner');
    expect(getComponentTag(<BarcodeScanner onScanned={noop} />)).toBe('BarcodeScanner');
    expect(getComponentTag(<LottieView source={{ uri: 'https://example.com/a.json' }} />)).toBe(
      'LottieView',
    );
  });
});

describe('Media — renders without throwing', () => {
  // Zero-dep primitives render real UI.
  it('renders zero-dep primitives', () => {
    expect(() => render(<ResponsiveImage uri="https://example.com/a.png" />)).not.toThrow();
    expect(() => render(<ImagePreview src="https://example.com/a.png" />)).not.toThrow();
    expect(() => render(<FilePreview name="report.pdf" size={2048} />)).not.toThrow();
    expect(() => render(<Logo label="Acme" />)).not.toThrow();
    expect(() => render(<Logo source="https://example.com/logo.png" />)).not.toThrow();
  });

  it('FilePreview derives type and formats size', () => {
    const { getByText } = render(<FilePreview name="report.pdf" size={2048} />);
    // The type badge is hidden from the accessibility tree (its content is
    // already in the container's label), so include hidden elements for it.
    expect(getByText('PDF', { includeHiddenElements: true })).toBeTruthy();
    expect(getByText('2 KB')).toBeTruthy();
  });

  // Gated peers render the MissingPeer fallback in tests since the peers are
  // not installed — this must not throw and must surface the install command.
  it('gated peers render the MissingPeer fallback', () => {
    expect(
      render(<VideoPlayer source={{ uri: 'https://example.com/v.mp4' }} />).getAllByText(
        /expo-video/,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      render(<AudioPlayer source={{ uri: 'https://example.com/a.mp3' }} />).getAllByText(/expo-av/)
        .length,
    ).toBeGreaterThan(0);
    expect(
      render(<PDFViewer source={{ uri: 'https://example.com/d.pdf' }} />).getAllByText(
        /react-native-pdf/,
      ).length,
    ).toBeGreaterThan(0);
    expect(
      render(<QRScanner onScanned={noop} />).getAllByText(/expo-camera/).length,
    ).toBeGreaterThan(0);
    expect(
      render(<BarcodeScanner onScanned={noop} />).getAllByText(/expo-camera/).length,
    ).toBeGreaterThan(0);
    expect(
      render(<LottieView source={{ uri: 'https://example.com/a.json' }} />).getAllByText(
        /lottie-react-native/,
      ).length,
    ).toBeGreaterThan(0);
  });
});
