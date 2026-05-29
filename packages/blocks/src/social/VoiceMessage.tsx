import { Caption, HStack, IconButton, Progress, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

export interface VoiceMessageProps {
  /** Pre-formatted total duration, e.g. "0:42". */
  readonly duration: string;
  /** Whether playback is active (controls the play/pause glyph). */
  readonly playing?: boolean;
  /** Called when the play/pause control is pressed. */
  readonly onTogglePlay?: () => void;
  /** Playback progress 0–1. Omit for an idle bar. */
  readonly progress?: number;
  /** Disable the control. */
  readonly disabled?: boolean;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const PLAY_GLYPH = '▶'; // play
const PAUSE_GLYPH = '❚❚'; // pause

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
});

const VoiceMessageImpl = React.forwardRef<View, VoiceMessageProps>(
  function VoiceMessage(props, ref) {
    const { duration, playing = false, onTogglePlay, progress, disabled = false, style } = props;
    const tokens = useTokens();

    const glyphColor: TextStyle = { color: tokens.colors.text.onAccent };

    return (
      <HStack ref={ref} gap="sm" align="center" style={style}>
        <IconButton
          accessibilityLabel={playing ? 'Pause' : 'Play'}
          onPress={onTogglePlay}
          disabled={disabled || !onTogglePlay}
          variant="solid"
          tone="primary"
          size="sm"
        >
          <Text variant="bodySm" style={glyphColor}>
            {playing ? PAUSE_GLYPH : PLAY_GLYPH}
          </Text>
        </IconButton>
        <Progress
          value={progress ?? 0}
          style={staticStyles.grow}
          accessibilityLabel="Playback progress"
        />
        <Caption tone="muted">{duration}</Caption>
      </HStack>
    );
  },
);

VoiceMessageImpl.displayName = 'VoiceMessage';

export const VoiceMessage = React.memo(VoiceMessageImpl);
