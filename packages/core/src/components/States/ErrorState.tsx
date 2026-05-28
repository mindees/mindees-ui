import * as React from 'react';
import type { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button } from '../Button/Button';

import { StateView, type StateViewBaseProps } from './StateView';

export interface ErrorStateProps extends StateViewBaseProps {
  /** Convenience retry handler; renders a default retry button when `action` is omitted. */
  readonly onRetry?: () => void;
  /** Retry button label used with `onRetry`. */
  readonly retryLabel?: string;
}

const ErrorStateImpl = React.forwardRef<View, ErrorStateProps>(function ErrorState(props, ref) {
  const { onRetry, retryLabel = 'Try again', action, ...rest } = props;
  const resolvedAction =
    action ??
    (onRetry ? (
      <Button tone="danger" onPress={onRetry}>
        {retryLabel}
      </Button>
    ) : undefined);
  return (
    <StateView
      ref={ref}
      tone="danger"
      defaultTitle="Something went wrong"
      action={resolvedAction}
      {...rest}
    />
  );
});

ErrorStateImpl.displayName = 'ErrorState';

const ErrorStateMemo = React.memo(ErrorStateImpl);
ErrorStateMemo.displayName = 'ErrorState';

/** Error screen: title + description + optional retry action. */
export const ErrorState = tagComponent(ErrorStateMemo, 'ErrorState');
