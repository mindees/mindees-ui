import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Heading, type HeadingProps } from './Heading';

export type SubheadingProps = Omit<HeadingProps, 'level'>;

/**
 * Secondary heading. A muted `h4`-level heading for section subtitles that sit
 * under a primary `Heading`. Composes `Heading` so it keeps the header
 * accessibility role.
 */
const SubheadingImpl = React.forwardRef<RNText, SubheadingProps>(function Subheading(props, ref) {
  const { tone = 'secondary', ...rest } = props;
  return <Heading ref={ref} level={4} tone={tone} {...rest} />;
});

SubheadingImpl.displayName = 'Subheading';

export const Subheading = tagComponent(React.memo(SubheadingImpl), 'Subheading');
