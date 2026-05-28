import { Avatar, Button, useTokens, VStack, type AvatarSize } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface AvatarUploaderProps {
  /** Current avatar image URL. Falls back to initials/placeholder when absent. */
  readonly uri?: string;
  /** Name used to derive initials for the fallback avatar. */
  readonly name?: string;
  /** Called when the user requests to pick a new image. Pure UI — no FS access. */
  readonly onPick?: () => void;
  /** Disables the pick button and shows a spinner while an upload is in flight. */
  readonly loading?: boolean;
  /** Avatar size. Defaults to "xl". */
  readonly size?: AvatarSize;
  /** Label for the change button. Defaults to "Change photo". */
  readonly label?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { alignItems: 'center' },
});

const AvatarUploaderImpl = React.forwardRef<View, AvatarUploaderProps>(
  function AvatarUploader(props, ref) {
    const {
      uri,
      name,
      onPick,
      loading = false,
      size = 'xl',
      label = 'Change photo',
      style,
    } = props;
    const tokens = useTokens();

    const overlayStyle: ViewStyle = {
      position: 'absolute',
      right: -tokens.space['2xs'],
      bottom: -tokens.space['2xs'],
    };

    return (
      <VStack ref={ref} gap="sm" align="center" style={[staticStyles.root, style]}>
        <VStack>
          <Avatar src={uri} name={name} size={size} />
          {onPick ? (
            <Button
              variant="solid"
              tone="primary"
              size="sm"
              onPress={onPick}
              loading={loading}
              accessibilityLabel={label}
              style={overlayStyle}
            >
              {label}
            </Button>
          ) : null}
        </VStack>
      </VStack>
    );
  },
);

AvatarUploaderImpl.displayName = 'AvatarUploader';

export const AvatarUploader = React.memo(AvatarUploaderImpl);
