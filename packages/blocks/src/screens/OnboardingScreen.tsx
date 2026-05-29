import { Box, Button, Heading, ScreenWrapper, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface OnboardingScreenProps {
  /** Page heading. */
  readonly title: string;
  /** Supporting body copy under the title. */
  readonly body?: string;
  /** Illustration slot rendered above the title. */
  readonly illustration?: React.ReactNode;
  /** Label for the primary action. Defaults to "Get started". */
  readonly nextLabel?: string;
  /** Called when the primary action is pressed. The button is omitted when absent. */
  readonly onNext?: () => void;
  /** Label for the secondary action. Defaults to "Skip". */
  readonly skipLabel?: string;
  /** Called when the secondary action is pressed. The button is omitted when absent. */
  readonly onSkip?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, justifyContent: 'center' },
  illustration: { alignItems: 'center' },
});

const OnboardingScreenImpl = React.forwardRef<View, OnboardingScreenProps>(
  function OnboardingScreen(props, ref) {
    const {
      title,
      body,
      illustration,
      nextLabel = 'Get started',
      onNext,
      skipLabel = 'Skip',
      onSkip,
      style,
    } = props;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper padding="lg">
          <VStack gap="lg" style={staticStyles.body}>
            {illustration ? <View style={staticStyles.illustration}>{illustration}</View> : null}
            <VStack gap="sm">
              <Heading level={2} align="center">
                {title}
              </Heading>
              {body ? (
                <Text variant="body" tone="muted" align="center">
                  {body}
                </Text>
              ) : null}
            </VStack>
          </VStack>
          <VStack gap="sm">
            {onNext ? (
              <Button tone="primary" fullWidth onPress={onNext}>
                {nextLabel}
              </Button>
            ) : null}
            {onSkip ? (
              <Button variant="ghost" tone="neutral" fullWidth onPress={onSkip}>
                {skipLabel}
              </Button>
            ) : null}
          </VStack>
        </ScreenWrapper>
      </Box>
    );
  },
);

OnboardingScreenImpl.displayName = 'OnboardingScreen';

/** A single onboarding page: illustration slot, title, body, and actions. */
export const OnboardingScreen = React.memo(OnboardingScreenImpl);
