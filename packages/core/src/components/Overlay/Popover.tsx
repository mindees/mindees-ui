import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewStyle } from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface PopoverProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly placement?: 'top' | 'bottom';
  readonly trigger: React.ReactElement;
  readonly children?: React.ReactNode;
  /** Style applied to the elevated popover panel. */
  readonly style?: StyleProp<ViewStyle>;
}

const PopoverImpl = React.forwardRef<View, PopoverProps>(function Popover(props, ref) {
  const { visible, onClose, placement = 'bottom', trigger, children, style } = props;
  const tokens = useTokens();

  const wrap: ViewStyle = { position: 'relative', alignSelf: 'flex-start' };
  const panel: ViewStyle = {
    position: 'absolute',
    [placement === 'top' ? 'bottom' : 'top']: '100%',
    left: 0,
    marginVertical: tokens.space.xs,
    backgroundColor: tokens.colors.background.elevated,
    borderRadius: tokens.radii.lg,
    borderColor: tokens.colors.border.subtle,
    borderWidth: 1,
    padding: tokens.space.md,
    minWidth: 200,
    ...resolveShadow('lg'),
  };

  return (
    <View style={wrap}>
      {trigger}
      {visible ? (
        <Pressable
          ref={ref}
          accessibilityRole="none"
          onPress={onClose}
          style={[panel, { left: undefined, right: undefined, alignSelf: 'flex-start' }, style]}
        >
          {children}
        </Pressable>
      ) : null}
    </View>
  );
});

PopoverImpl.displayName = 'Popover';

export const Popover = tagComponent(PopoverImpl, 'Popover');
