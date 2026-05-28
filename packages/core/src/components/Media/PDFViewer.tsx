import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

export interface PDFViewerProps {
  /** Remote or local URI of the PDF document. */
  readonly source: { readonly uri: string } | string;
  readonly [key: string]: unknown;
}

type PdfPeer = React.ComponentType<Record<string, unknown>>;

const PDFViewerImpl = React.forwardRef<View, PDFViewerProps>(function PDFViewer(props, _ref) {
  const Peer = tryLoadPeer<PdfPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-pdf') as { default: PdfPeer };
    return mod.default;
  });
  if (!Peer) {
    return (
      <MissingPeer
        peer="react-native-pdf"
        install="pnpm add react-native-pdf"
        label="PDFViewer requires react-native-pdf"
      />
    );
  }
  const { source, ...rest } = props;
  // The string index signature collapses explicit members to `unknown` through
  // forwardRef, so re-narrow `source` at this call site.
  const src = source as PDFViewerProps['source'];
  const normalized = typeof src === 'string' ? { uri: src } : src;
  return <Peer source={normalized} {...rest} />;
});

PDFViewerImpl.displayName = 'PDFViewer';

export const PDFViewer = tagComponent(React.memo(PDFViewerImpl), 'PDFViewer');
