import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { useTokens } from '../../theme/ThemeProvider';
import { Heading } from '../Text/Heading';
import { Text, type TextTone } from '../Text/Text';

/**
 * Shared props every state primitive accepts. State components are simple
 * centered layouts — an optional icon/illustration slot, a title, a
 * description, and an optional action — differing only by tone and default
 * copy. This keeps each component light for low-end Android (no per-render
 * allocation of static style objects; the only object built per render is the
 * tokens-derived container style, which depends on the active theme).
 */
export interface StateViewBaseProps extends Omit<ViewProps, 'style'> {
  /** Heading copy. Falls back to the component's per-state default. */
  readonly title?: string;
  /** Supporting copy shown under the title. */
  readonly description?: string;
  /** Icon or illustration rendered above the title. */
  readonly icon?: React.ReactNode;
  /** Action node (typically a `Button`) rendered below the description. */
  readonly action?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

interface StateViewProps extends StateViewBaseProps {
  /** Tone applied to the title text. */
  readonly tone: TextTone;
  /** Default title used when `title` is omitted. */
  readonly defaultTitle: string;
}

/**
 * Internal presentational core shared by every state primitive. Not tagged or
 * exported from the barrel — each public state wraps this with its own tag,
 * default copy, and tone.
 */
export const StateView = React.forwardRef<View, StateViewProps>(function StateView(props, ref) {
  const { title, description, icon, action, tone, defaultTitle, style, ...rest } = props;
  const tokens = useTokens();
  const resolvedTitle = title ?? defaultTitle;
  return (
    <View
      ref={ref}
      accessibilityRole="summary"
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          gap: tokens.space.sm,
          padding: tokens.space.xl,
        },
        style,
      ]}
      {...rest}
    >
      {icon}
      <Heading level={4} tone={tone} align="center">
        {resolvedTitle}
      </Heading>
      {description ? (
        <Text variant="body" tone="muted" align="center">
          {description}
        </Text>
      ) : null}
      {action}
    </View>
  );
});

StateView.displayName = 'StateView';
