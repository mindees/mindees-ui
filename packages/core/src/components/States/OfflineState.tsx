import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button } from '../Button/Button';

import { StateView, type StateViewBaseProps } from './StateView';

export interface OfflineStateProps extends StateViewBaseProps {
  /** Convenience retry handler; renders a default retry button when `action` is omitted. */
  readonly onRetry?: () => void;
  /** Retry button label used with `onRetry`. */
  readonly retryLabel?: string;
}

const OfflineStateImpl = React.forwardRef<View, OfflineStateProps>(
  function OfflineState(props, ref) {
    const { onRetry, retryLabel = 'Retry', action, ...rest } = props;
    const resolvedAction =
      action ??
      (onRetry ? (
        <Button tone="neutral" onPress={onRetry}>
          {retryLabel}
        </Button>
      ) : undefined);
    return (
      <StateView
        ref={ref}
        tone="warning"
        defaultTitle="You're offline"
        action={resolvedAction}
        {...rest}
      />
    );
  },
);

OfflineStateImpl.displayName = 'OfflineState';

const OfflineStateMemo = React.memo(OfflineStateImpl);
OfflineStateMemo.displayName = 'OfflineState';

/** "No internet" screen: message + optional retry action. */
export const OfflineState = tagComponent(OfflineStateMemo, 'OfflineState');
