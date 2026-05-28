import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { StateView, type StateViewBaseProps } from './StateView';

export type SuccessStateProps = StateViewBaseProps;

const SuccessStateImpl = React.forwardRef<View, SuccessStateProps>(
  function SuccessState(props, ref) {
    return <StateView ref={ref} tone="success" defaultTitle="All done" {...props} />;
  },
);

SuccessStateImpl.displayName = 'SuccessState';

const SuccessStateMemo = React.memo(SuccessStateImpl);
SuccessStateMemo.displayName = 'SuccessState';

/** Success screen: title + description + optional action. */
export const SuccessState = tagComponent(SuccessStateMemo, 'SuccessState');
