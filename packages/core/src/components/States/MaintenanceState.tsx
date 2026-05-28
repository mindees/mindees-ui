import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { StateView, type StateViewBaseProps } from './StateView';

export type MaintenanceStateProps = StateViewBaseProps;

const MaintenanceStateImpl = React.forwardRef<View, MaintenanceStateProps>(
  function MaintenanceState(props, ref) {
    const { description, ...rest } = props;
    return (
      <StateView
        ref={ref}
        tone="info"
        defaultTitle="Under maintenance"
        description={description ?? "We're making things better. Please check back soon."}
        {...rest}
      />
    );
  },
);

MaintenanceStateImpl.displayName = 'MaintenanceState';

const MaintenanceStateMemo = React.memo(MaintenanceStateImpl);
MaintenanceStateMemo.displayName = 'MaintenanceState';

/** "Under maintenance" screen. */
export const MaintenanceState = tagComponent(MaintenanceStateMemo, 'MaintenanceState');
