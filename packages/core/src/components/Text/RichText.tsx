import * as React from 'react';
import type { Text as RNText, TextStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Code } from './Code';
import { Text, type TextProps } from './Text';

/** A single inline run. Keep this intentionally minimal — no markdown parsing. */
export interface RichTextSegment {
  readonly text: string;
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly code?: boolean;
  /** Explicit color override for this run. */
  readonly color?: string;
}

export interface RichTextProps extends Omit<TextProps, 'children'> {
  /** Ordered inline runs rendered into one Text as nested spans. */
  readonly segments: readonly RichTextSegment[];
}

const BOLD_STYLE: TextStyle = { fontWeight: '700' };

function renderSegment(segment: RichTextSegment, index: number): React.ReactElement {
  const { text, bold, italic, code, color } = segment;
  const key = `${index}:${text}`;
  if (code) {
    return (
      <Code key={key} inline italic={italic} style={color ? { color } : undefined}>
        {text}
      </Code>
    );
  }
  const spanStyle: TextStyle | undefined =
    bold || color ? { ...(bold ? BOLD_STYLE : null), ...(color ? { color } : null) } : undefined;
  return (
    <Text key={key} italic={italic} style={spanStyle}>
      {text}
    </Text>
  );
}

/**
 * Renders an array of simple inline segments into a single Text composed of
 * nested Text spans. Supports bold / italic / inline-code / per-run color —
 * deliberately not a markdown renderer.
 */
const RichTextImpl = React.forwardRef<RNText, RichTextProps>(function RichText(props, ref) {
  const { segments, ...rest } = props;
  return (
    <Text ref={ref} {...rest}>
      {segments.map(renderSegment)}
    </Text>
  );
});

RichTextImpl.displayName = 'RichText';

export const RichText = tagComponent(React.memo(RichTextImpl), 'RichText');
