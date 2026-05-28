import * as React from 'react';

import { useTokens } from '../../../theme/ThemeProvider';
import { Text } from '../../Text/Text';
import {
  resolveButtonTextColor,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from '../Button';

export interface GlyphAffordanceProps {
  /** Single text glyph used as a visual affordance (not an emoji). */
  readonly glyph: string;
  /** Mirror the host Button's variant so the glyph color matches the label. */
  readonly variant?: ButtonVariant;
  readonly tone?: ButtonTone;
  readonly size?: ButtonSize;
}

const GLYPH_VARIANT: Record<ButtonSize, 'bodyLg' | 'body' | 'bodySm'> = {
  lg: 'bodyLg',
  md: 'body',
  sm: 'bodySm',
};

/**
 * A tiny Text-based glyph affordance used by Button presets that lack a
 * dedicated icon component in `@mindees/icons`. Keeps presets token-driven and
 * dependency-free while matching the Button's resolved label color.
 */
function GlyphAffordanceImpl(props: GlyphAffordanceProps): React.ReactElement {
  const { glyph, variant = 'solid', tone = 'primary', size = 'md' } = props;
  const tokens = useTokens();
  const color = resolveButtonTextColor(tokens, variant, tone);
  return (
    <Text
      variant={GLYPH_VARIANT[size]}
      weight="semibold"
      aria-hidden
      importantForAccessibility="no"
      style={{ color }}
    >
      {glyph}
    </Text>
  );
}

export const GlyphAffordance = React.memo(GlyphAffordanceImpl);
GlyphAffordance.displayName = 'GlyphAffordance';
