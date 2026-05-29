import { Button } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

export interface FollowButtonProps {
  /** Whether the viewer currently follows the target. */
  readonly following?: boolean;
  /** Called with the next following state when pressed. */
  readonly onToggle?: (next: boolean) => void;
  /** Shows a spinner and blocks interaction while a request is in flight. */
  readonly loading?: boolean;
  /** Disable interaction. */
  readonly disabled?: boolean;
  /** Label shown when not following. Defaults to "Follow". */
  readonly followLabel?: string;
  /** Label shown when already following. Defaults to "Following". */
  readonly followingLabel?: string;
  /** Style spread onto the root button. */
  readonly style?: StyleProp<ViewStyle>;
}

const FollowButtonImpl = React.forwardRef<View, FollowButtonProps>(
  function FollowButton(props, ref) {
    const {
      following = false,
      onToggle,
      loading = false,
      disabled = false,
      followLabel = 'Follow',
      followingLabel = 'Following',
      style,
    } = props;

    const handlePress = React.useCallback(() => {
      onToggle?.(!following);
    }, [onToggle, following]);

    return (
      <Button
        ref={ref}
        variant={following ? 'outline' : 'solid'}
        tone={following ? 'neutral' : 'primary'}
        size="sm"
        loading={loading}
        disabled={disabled}
        onPress={handlePress}
        accessibilityState={{ selected: following }}
        style={style}
      >
        {following ? followingLabel : followLabel}
      </Button>
    );
  },
);

FollowButtonImpl.displayName = 'FollowButton';

export const FollowButton = React.memo(FollowButtonImpl);
