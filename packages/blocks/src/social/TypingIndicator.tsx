import { Box, Caption, HStack, useTokens } from '@mindees/ui';
import * as React from 'react';
import { Animated, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface TypingIndicatorProps {
  /** Optional name shown as "{name} is typing…". When omitted only dots show. */
  readonly name?: string;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const DOT_COUNT = 3;
const DOT_DELAY = 150;
const DOT_DURATION = 400;

const staticStyles = StyleSheet.create({
  dotRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3 },
});

function useDotAnimation(): readonly Animated.Value[] {
  const dots = React.useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0.3)),
  ).current;

  React.useEffect(() => {
    const animations = dots.map((dot, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * DOT_DELAY),
          Animated.timing(dot, {
            toValue: 1,
            duration: DOT_DURATION,
            useNativeDriver: false,
          }),
          Animated.timing(dot, {
            toValue: 0.3,
            duration: DOT_DURATION,
            useNativeDriver: false,
          }),
        ]),
      ),
    );
    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [dots]);

  return dots;
}

const TypingIndicatorImpl = React.forwardRef<View, TypingIndicatorProps>(
  function TypingIndicator(props, ref) {
    const { name, style } = props;
    const tokens = useTokens();
    const dots = useDotAnimation();

    const bubbleStyle: ViewStyle = {
      backgroundColor: tokens.colors.background.subtle,
      paddingHorizontal: tokens.space.sm,
      paddingVertical: tokens.space.xs,
      borderRadius: tokens.radii.lg,
      alignSelf: 'flex-start',
    };
    const dotColor: ViewStyle = { backgroundColor: tokens.colors.text.muted };
    const label = name ? `${name} is typing` : 'Typing';

    return (
      <HStack
        ref={ref}
        gap="xs"
        align="center"
        accessibilityRole="text"
        accessibilityLabel={`${label}…`}
        style={style}
      >
        {name ? (
          <Caption tone="muted" numberOfLines={1}>
            {name}
          </Caption>
        ) : null}
        <Box
          style={bubbleStyle}
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        >
          <View style={staticStyles.dotRow}>
            {dots.map((dot, i) => (
              <Animated.View key={i} style={[staticStyles.dot, dotColor, { opacity: dot }]} />
            ))}
          </View>
        </Box>
      </HStack>
    );
  },
);

TypingIndicatorImpl.displayName = 'TypingIndicator';

export const TypingIndicator = React.memo(TypingIndicatorImpl);
