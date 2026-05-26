import type { TextStyleName } from '@mindees/tokens';
import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

const LEVEL_VARIANT: Record<HeadingLevel, TextStyleName> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

export interface HeadingProps extends Omit<TextProps, 'variant'> {
  /** Semantic heading level (1–6). Drives the type scale step. Defaults to 2. */
  readonly level?: HeadingLevel;
}

const HeadingImpl = React.forwardRef<RNText, HeadingProps>(function Heading(props, ref) {
  const { level = 2, accessibilityRole = 'header', ...rest } = props;
  return (
    <Text
      ref={ref}
      variant={LEVEL_VARIANT[level]}
      accessibilityRole={accessibilityRole}
      {...rest}
    />
  );
});

HeadingImpl.displayName = 'Heading';

export const Heading = tagComponent(HeadingImpl, 'Heading');
