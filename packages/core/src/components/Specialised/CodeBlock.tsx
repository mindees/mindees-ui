import * as React from 'react';
import { Platform, ScrollView, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

const monoFamily = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
});

export interface CodeBlockProps {
  readonly code: string;
  /** Hint for syntax highlighting; honored by Phase 7 syntax wrapper. */
  readonly language?: string;
  /** Show line numbers in a gutter. */
  readonly showLineNumbers?: boolean;
  readonly wrap?: boolean;
}

/**
 * Multi-line code block. The Phase 6 ship is a themed, monospaced, scrollable
 * `Text`. A real syntax-highlighting peer (e.g. `react-native-syntax-highlighter`)
 * can layer on top in Phase 7 without breaking the public API.
 */
const CodeBlockImpl = React.forwardRef<View, CodeBlockProps>(function CodeBlock(props, ref) {
  const { code, language, showLineNumbers = false, wrap = false } = props;
  const tokens = useTokens();
  const containerStyle: ViewStyle = {
    backgroundColor: tokens.colors.background.subtle,
    borderRadius: tokens.radii.md,
    padding: tokens.space.sm,
    flexDirection: 'row',
  };
  const lines = code.split('\n');
  return (
    <View
      ref={ref}
      accessibilityRole="text"
      accessibilityLabel={language ? `${language} code` : 'Code'}
      style={containerStyle}
    >
      {showLineNumbers ? (
        <View style={{ marginRight: tokens.space.sm, alignItems: 'flex-end' }}>
          {lines.map((_, i) => (
            <Text
              key={i}
              variant="code"
              tone="muted"
              fontFamily={monoFamily}
              accessibilityElementsHidden
            >
              {i + 1}
            </Text>
          ))}
        </View>
      ) : null}
      <ScrollView horizontal={!wrap} showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
        <Text variant="code" fontFamily={monoFamily} style={{ flexShrink: wrap ? 1 : 0 }}>
          {code}
        </Text>
      </ScrollView>
    </View>
  );
});

CodeBlockImpl.displayName = 'CodeBlock';

export const CodeBlock = tagComponent(CodeBlockImpl, 'CodeBlock');
