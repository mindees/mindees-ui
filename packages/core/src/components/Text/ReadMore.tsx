import * as React from 'react';
import type { Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export interface ReadMoreProps extends TextProps {
  /** Number of lines shown while collapsed. Defaults to 3. */
  readonly numberOfLines?: number;
  /** Toggle label shown when collapsed. Defaults to "Read more". */
  readonly moreLabel?: string;
  /** Toggle label shown when expanded. Defaults to "Show less". */
  readonly lessLabel?: string;
  /** Start expanded. Uncontrolled — used only for the initial state. */
  readonly defaultExpanded?: boolean;
}

/**
 * Collapsible text. Clamps to `numberOfLines` then reveals a tappable
 * "Read more" / "Show less" toggle. The toggle is a link-toned inline Text
 * with a button accessibility role.
 */
const ReadMoreImpl = React.forwardRef<RNText, ReadMoreProps>(function ReadMore(props, ref) {
  const {
    numberOfLines = 3,
    moreLabel = 'Read more',
    lessLabel = 'Show less',
    defaultExpanded = false,
    children,
    ...rest
  } = props;
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const toggle = React.useCallback(() => setExpanded((prev) => !prev), []);

  return (
    <Text ref={ref} numberOfLines={expanded ? undefined : numberOfLines} {...rest}>
      {children}
      {'\n'}
      <Text
        tone="link"
        weight="medium"
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={EXPANDED_STATE[expanded ? 1 : 0]}
      >
        {expanded ? lessLabel : moreLabel}
      </Text>
    </Text>
  );
});

// Hoisted so the accessibilityState object is not reallocated each render.
const EXPANDED_STATE = [{ expanded: false }, { expanded: true }] as const;

ReadMoreImpl.displayName = 'ReadMore';

export const ReadMore = tagComponent(React.memo(ReadMoreImpl), 'ReadMore');
