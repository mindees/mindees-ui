import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { MissingPeer, tryLoadPeer } from './optionalPeer';

export interface MindeesWebViewProps {
  readonly source: { readonly uri: string } | { readonly html: string };
  readonly onMessage?: (event: { nativeEvent: { data: string } }) => void;
  readonly [key: string]: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WebViewPeer = React.ComponentType<any>;

const WebViewImpl = React.forwardRef<View, MindeesWebViewProps>(function WebView(props, _ref) {
  const WebViewPeerComp = tryLoadPeer<WebViewPeer>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('react-native-webview') as { WebView: WebViewPeer };
    return mod.WebView;
  });
  if (!WebViewPeerComp) {
    return (
      <MissingPeer
        peer="react-native-webview"
        install="pnpm add react-native-webview"
        label="WebView requires react-native-webview"
      />
    );
  }
  return <WebViewPeerComp {...props} />;
});

WebViewImpl.displayName = 'WebView';

export const WebView = tagComponent(WebViewImpl, 'WebView');
