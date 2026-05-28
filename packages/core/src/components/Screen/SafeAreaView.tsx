import * as React from 'react';
import {
  SafeAreaView as RNSSafeAreaView,
  type SafeAreaViewProps,
} from 'react-native-safe-area-context';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface MindeesSafeAreaViewProps extends SafeAreaViewProps {
  /** Semantic background key. Defaults to `canvas`. Pass `null` to skip. */
  readonly background?: 'canvas' | 'surface' | 'subtle' | 'elevated' | null;
}

const SafeAreaViewImpl = React.forwardRef<unknown, MindeesSafeAreaViewProps>(
  function SafeAreaView(props, _ref) {
    const { background = 'canvas', style, children, ...rest } = props;
    const tokens = useTokens();
    const bgStyle =
      background === null ? undefined : { backgroundColor: tokens.colors.background[background] };
    return (
      <RNSSafeAreaView style={[bgStyle, style]} {...rest}>
        {children}
      </RNSSafeAreaView>
    );
  },
);

SafeAreaViewImpl.displayName = 'SafeAreaView';

// `react-native-safe-area-context`'s `SafeAreaView` is a function component
// without a forwardable ref, so the forwarded ref is intentionally ignored.
export const SafeAreaView = tagComponent(
  SafeAreaViewImpl as unknown as React.ComponentType<MindeesSafeAreaViewProps>,
  'SafeAreaView',
);
