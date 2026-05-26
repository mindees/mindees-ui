import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface TooltipProps {
  readonly label: string;
  readonly placement?: 'top' | 'bottom';
  readonly children: React.ReactElement;
  /** Override the show state (controlled). */
  readonly visible?: boolean;
  readonly defaultVisible?: boolean;
}

/**
 * Pressable-driven tooltip. Mobile platforms don't have hover, so the
 * tooltip shows on long-press / focus. The trigger element is rendered
 * untouched; the bubble overlays it via absolute positioning.
 */
const TooltipImpl = React.forwardRef<View, TooltipProps>(function Tooltip(props, _ref) {
  const { label, placement = 'top', children, visible, defaultVisible = false } = props;
  const tokens = useTokens();
  const [internal, setInternal] = React.useState(defaultVisible);
  const isVisible = visible ?? internal;

  const wrap: ViewStyle = { position: 'relative', alignSelf: 'flex-start' };
  const bubble: ViewStyle = {
    position: 'absolute',
    [placement === 'top' ? 'bottom' : 'top']: '100%',
    left: 0,
    marginVertical: tokens.space['2xs'],
    backgroundColor: tokens.colors.background.inverse,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space['2xs'],
    borderRadius: tokens.radii.sm,
    ...resolveShadow('md'),
  };

  return (
    <View style={wrap}>
      <Pressable
        onLongPress={() => setInternal(true)}
        onPressOut={() => setInternal(false)}
        delayLongPress={400}
        accessibilityLabel={label}
      >
        {children}
      </Pressable>
      {isVisible ? (
        <View style={bubble} accessibilityRole="text" pointerEvents="none">
          <Text variant="caption" tone="inverse">
            {label}
          </Text>
        </View>
      ) : null}
    </View>
  );
});

TooltipImpl.displayName = 'Tooltip';

export const Tooltip = tagComponent(TooltipImpl, 'Tooltip');
