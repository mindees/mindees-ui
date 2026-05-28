import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { StateView, type StateViewBaseProps } from './StateView';

export type WarningStateProps = StateViewBaseProps;

const WarningStateImpl = React.forwardRef<View, WarningStateProps>(
  function WarningState(props, ref) {
    return <StateView ref={ref} tone="warning" defaultTitle="Heads up" {...props} />;
  },
);

WarningStateImpl.displayName = 'WarningState';

const WarningStateMemo = React.memo(WarningStateImpl);
WarningStateMemo.displayName = 'WarningState';

/** Warning screen: title + description. */
export const WarningState = tagComponent(WarningStateMemo, 'WarningState');
