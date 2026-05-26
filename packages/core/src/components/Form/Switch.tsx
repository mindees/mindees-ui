import * as React from 'react';
import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface SwitchProps extends Omit<RNSwitchProps, 'thumbColor' | 'trackColor'> {
  /** Override the accent colour. Defaults to `theme.colors.action.primary`. */
  readonly accent?: string;
}

const SwitchImpl = React.forwardRef<RNSwitch, SwitchProps>(function Switch(props, ref) {
  const { accent, ...rest } = props;
  const tokens = useTokens();
  const onColor = accent ?? tokens.colors.action.primary;
  return (
    <RNSwitch
      ref={ref}
      trackColor={{ false: tokens.colors.border.default, true: onColor }}
      thumbColor={tokens.colors.background.surface}
      ios_backgroundColor={tokens.colors.border.default}
      accessibilityRole="switch"
      {...rest}
    />
  );
});

SwitchImpl.displayName = 'Switch';

export const Switch = tagComponent(SwitchImpl, 'Switch');
