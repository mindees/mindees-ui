import * as React from 'react';
import { View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

/**
 * Render the result of `loader()` if it succeeds, otherwise render a clearly-
 * labeled fallback explaining which peer dependency is missing. Lets us ship
 * `QRCode`, `MapView`, `Camera`, etc. without forcing users to install those
 * peers — they only pay (and only see real renders) when they consume the
 * matching wrapper.
 */
export function tryLoadPeer<T>(loader: () => T): T | null {
  try {
    return loader();
  } catch {
    return null;
  }
}

export interface MissingPeerProps {
  readonly peer: string;
  readonly install: string;
  readonly label?: string;
}

const MissingPeerImpl = React.forwardRef<View, MissingPeerProps>(function MissingPeer(props, ref) {
  const { peer, install, label } = props;
  const tokens = useTokens();
  return (
    <View
      ref={ref}
      accessibilityRole="alert"
      style={{
        padding: tokens.space.md,
        borderRadius: tokens.radii.md,
        backgroundColor: tokens.colors.status.warningSubtle,
        borderColor: tokens.colors.status.warning,
        borderWidth: 1,
        gap: tokens.space['2xs'],
      }}
    >
      <Text variant="label" weight="semibold" tone="warning">
        {label ?? `Optional peer "${peer}" is not installed`}
      </Text>
      <Text variant="caption" tone="secondary">
        Install it with: <Text variant="code">{install}</Text>
      </Text>
    </View>
  );
});

MissingPeerImpl.displayName = 'MissingPeer';

export const MissingPeer = tagComponent(MissingPeerImpl, 'EmptyState');
