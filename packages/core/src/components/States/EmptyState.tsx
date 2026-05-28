import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { StateView, type StateViewBaseProps } from './StateView';

export type EmptyStateProps = StateViewBaseProps;

const EmptyStateImpl = React.forwardRef<View, EmptyStateProps>(function EmptyState(props, ref) {
  return <StateView ref={ref} tone="secondary" defaultTitle="Nothing here yet" {...props} />;
});

EmptyStateImpl.displayName = 'EmptyState';

const EmptyStateMemo = React.memo(EmptyStateImpl);
EmptyStateMemo.displayName = 'EmptyState';

/** "No data" placeholder: icon/illustration + title + description + optional action. */
export const EmptyState = tagComponent(EmptyStateMemo, 'EmptyState');
