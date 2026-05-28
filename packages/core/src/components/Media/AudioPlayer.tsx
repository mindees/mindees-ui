import * as React from 'react';
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';
import { Text } from '../Text/Text';

export interface AudioPlayerProps {
  /** Remote or local URI of the audio clip. */
  readonly source: { readonly uri: string } | string;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
}

/** Minimal surface of `expo-av`'s `Audio.Sound` instance that we depend on. */
interface SoundLike {
  playAsync(): Promise<unknown>;
  pauseAsync(): Promise<unknown>;
  unloadAsync(): Promise<unknown>;
}

interface ExpoAvAudio {
  Sound: {
    createAsync(
      source: { uri: string },
      options?: Record<string, unknown>,
    ): Promise<{ sound: SoundLike }>;
  };
}

const styles = StyleSheet.create({
  button: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
});

const AudioPlayerImpl = React.forwardRef<View, AudioPlayerProps>(function AudioPlayer(props, ref) {
  const { source, accessibilityLabel, style, ...rest } = props;
  const tokens = useTokens();
  const Audio = tryLoadPeer<ExpoAvAudio['Sound'] | null>(() => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mod = require('expo-av') as { Audio: ExpoAvAudio };
    return mod.Audio.Sound;
  });

  const soundRef = React.useRef<SoundLike | null>(null);
  const [playing, setPlaying] = React.useState(false);

  const uri = typeof source === 'string' ? source : source.uri;

  React.useEffect(() => {
    // Release any loaded sound on unmount / source change to avoid leaks on
    // low-end devices that hold onto native media buffers.
    return () => {
      soundRef.current?.unloadAsync().catch(() => undefined);
      soundRef.current = null;
    };
  }, [uri]);

  const toggle = React.useCallback(() => {
    if (!Audio) return;
    void (async () => {
      try {
        if (!soundRef.current) {
          const { sound } = await Audio.createAsync({ uri });
          soundRef.current = sound;
        }
        if (playing) {
          await soundRef.current.pauseAsync();
          setPlaying(false);
        } else {
          await soundRef.current.playAsync();
          setPlaying(true);
        }
      } catch {
        // Swallow playback errors — surfacing them is the consumer's call.
      }
    })();
  }, [Audio, uri, playing]);

  const containerStyle = React.useMemo<ViewStyle>(
    () => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.space.sm,
      padding: tokens.space.sm,
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.border.subtle,
      backgroundColor: tokens.colors.background.surface,
    }),
    [tokens],
  );

  const buttonStyle = React.useMemo<ViewStyle>(
    () => ({
      ...styles.button,
      borderRadius: tokens.radii.full,
      backgroundColor: tokens.colors.action.primary,
    }),
    [tokens],
  );

  const glyphStyle = React.useMemo<{ color: string }>(
    () => ({ color: tokens.colors.text.onAccent }),
    [tokens],
  );

  if (!Audio) {
    return (
      <MissingPeer peer="expo-av" install="pnpm add expo-av" label="AudioPlayer requires expo-av" />
    );
  }

  return (
    <View ref={ref} style={[containerStyle, style]} {...rest}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ selected: playing }}
        accessibilityLabel={accessibilityLabel ?? (playing ? 'Pause audio' : 'Play audio')}
        hitSlop={8}
        style={buttonStyle}
      >
        <Text variant="label" weight="bold" style={glyphStyle}>
          {playing ? 'II' : '>'}
        </Text>
      </Pressable>
      <Text variant="label" tone="secondary" numberOfLines={1} style={styles.label}>
        {playing ? 'Playing' : 'Paused'}
      </Text>
    </View>
  );
});

AudioPlayerImpl.displayName = 'AudioPlayer';

export const AudioPlayer = tagComponent(React.memo(AudioPlayerImpl), 'AudioPlayer');
