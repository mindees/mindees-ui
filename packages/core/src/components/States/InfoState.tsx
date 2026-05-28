import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { StateView, type StateViewBaseProps } from './StateView';

export type InfoStateProps = StateViewBaseProps;

const InfoStateImpl = React.forwardRef<View, InfoStateProps>(function InfoState(props, ref) {
  return <StateView ref={ref} tone="info" defaultTitle="Good to know" {...props} />;
});

InfoStateImpl.displayName = 'InfoState';

const InfoStateMemo = React.memo(InfoStateImpl);
InfoStateMemo.displayName = 'InfoState';

/** Informational screen: title + description. */
export const InfoState = tagComponent(InfoStateMemo, 'InfoState');
