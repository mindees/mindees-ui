import { Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

export interface LikeButtonProps {
  /** Whether the current viewer has liked. */
  readonly liked?: boolean;
  /** Total like count. Hidden when undefined. */
  readonly count?: number;
  /** Called with the next liked state when toggled. */
  readonly onToggle?: (next: boolean) => void;
  /** Disable interaction. */
  readonly disabled?: boolean;
  /** Style spread onto the root pressable. */
  readonly style?: StyleProp<ViewStyle>;
}

const FILLED = '♥'; // heart
const OUTLINE = '♡'; // heart outline

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
});

const LikeButtonImpl = React.forwardRef<View, LikeButtonProps>(function LikeButton(props, ref) {
  const { liked = false, count, onToggle, disabled = false, style } = props;
  const tokens = useTokens();

  const handlePress = React.useCallback(() => {
    if (!disabled) onToggle?.(!liked);
  }, [disabled, onToggle, liked]);

  const glyphStyle: TextStyle = {
    color: liked ? tokens.colors.status.danger : tokens.colors.text.muted,
  };
  const disabledStyle: ViewStyle = disabled ? { opacity: 0.5 } : EMPTY;

  return (
    <Pressable
      ref={ref}
      accessibilityRole="button"
      accessibilityState={{ selected: liked, disabled }}
      accessibilityLabel={liked ? 'Unlike' : 'Like'}
      hitSlop={8}
      disabled={disabled || !onToggle}
      onPress={handlePress}
      style={[staticStyles.row, disabledStyle, style]}
    >
      <Text variant="body" style={glyphStyle}>
        {liked ? FILLED : OUTLINE}
      </Text>
      {count !== undefined ? (
        <Text variant="bodySm" tone="secondary">
          {count}
        </Text>
      ) : null}
    </Pressable>
  );
});

const EMPTY: ViewStyle = {};

LikeButtonImpl.displayName = 'LikeButton';

export const LikeButton = React.memo(LikeButtonImpl);
