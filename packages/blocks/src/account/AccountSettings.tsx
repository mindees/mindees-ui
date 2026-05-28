import { SettingsMenu, type SettingsMenuGroup } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

export interface AccountSettingsProps {
  /** Grouped settings rows. Mirrors the SettingsMenu primitive's API. */
  readonly groups: readonly SettingsMenuGroup[];
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const AccountSettingsImpl = React.forwardRef<View, AccountSettingsProps>(
  function AccountSettings(props, ref) {
    const { groups, style } = props;
    return <SettingsMenu ref={ref} groups={groups} style={style} />;
  },
);

AccountSettingsImpl.displayName = 'AccountSettings';

export const AccountSettings = React.memo(AccountSettingsImpl);
