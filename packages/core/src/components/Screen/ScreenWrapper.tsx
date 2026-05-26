import { type SpaceToken, space } from '@mindees/tokens';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  type ScrollViewProps,
  StatusBar,
  View,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens, useTheme } from '../../theme/ThemeProvider';

type Edge = 'top' | 'right' | 'bottom' | 'left';
const DEFAULT_EDGES: readonly Edge[] = ['top', 'right', 'bottom', 'left'];

export interface ScreenWrapperProps {
  readonly children?: React.ReactNode;
  /** Edges to inset for the safe-area. Pass `[]` to disable. Defaults to all four. */
  readonly edges?: readonly Edge[];
  /** Semantic theme background. Defaults to `canvas`. */
  readonly background?: 'canvas' | 'surface' | 'subtle' | 'elevated';
  /** Wrap the content in a `ScrollView`. Defaults to `false`. */
  readonly scroll?: boolean;
  /** Add a `KeyboardAvoidingView` (iOS padding / Android height) above the content. */
  readonly avoidKeyboard?: boolean;
  /** Outer padding around content (token or dp). */
  readonly padding?: SpaceToken | number;
  readonly scrollViewProps?: Omit<ScrollViewProps, 'children'>;
}

/**
 * The recommended app-screen root. Combines:
 *   - SafeAreaView from react-native-safe-area-context (edge-to-edge friendly)
 *   - Themed background colour
 *   - Optional ScrollView wrapper for long content
 *   - Optional KeyboardAvoidingView for forms
 *   - Optional padding
 *   - Status bar style matching the current colour scheme
 */
const ScreenWrapperImpl = React.forwardRef<View, ScreenWrapperProps>(
  function ScreenWrapper(props, ref) {
    const {
      children,
      edges = DEFAULT_EDGES,
      background = 'canvas',
      scroll = false,
      avoidKeyboard = false,
      padding,
      scrollViewProps,
    } = props;
    const tokens = useTokens();
    const theme = useTheme();
    const padPx =
      padding === undefined ? 0 : typeof padding === 'number' ? padding : space[padding];

    const containerStyle: ViewStyle = {
      flex: 1,
      backgroundColor: tokens.colors.background[background],
    };

    const contentStyle: ViewStyle = { flexGrow: 1, padding: padPx };

    let content: React.ReactNode = children;
    if (scroll) {
      content = (
        <ScrollView contentContainerStyle={contentStyle} {...scrollViewProps}>
          {children}
        </ScrollView>
      );
    } else {
      content = <View style={contentStyle}>{children}</View>;
    }

    if (avoidKeyboard) {
      content = (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {content}
        </KeyboardAvoidingView>
      );
    }

    return (
      <SafeAreaView ref={ref} edges={edges as readonly Edge[]} style={containerStyle}>
        <StatusBar barStyle={theme.colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
        {content}
      </SafeAreaView>
    );
  },
);

ScreenWrapperImpl.displayName = 'ScreenWrapper';

export const ScreenWrapper = tagComponent(ScreenWrapperImpl, 'ScreenWrapper');
