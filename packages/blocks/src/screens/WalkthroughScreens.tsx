import { Box, Button, Carousel, Heading, ScreenWrapper, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface WalkthroughStep {
  /** Step heading. */
  readonly title: string;
  /** Supporting body copy. */
  readonly body?: string;
  /** Illustration slot rendered above the title. */
  readonly illustration?: React.ReactNode;
}

export interface WalkthroughScreensProps {
  /** Ordered walkthrough steps, one page each. Swipe horizontally to advance. */
  readonly steps: readonly WalkthroughStep[];
  /** Label for the final button shown on the last step. Defaults to "Done". */
  readonly doneLabel?: string;
  /** Label for the skip button. Defaults to "Skip". */
  readonly skipLabel?: string;
  /** Hint shown beside the dots on non-final steps. Defaults to "Swipe to continue". */
  readonly hint?: string;
  /** Called when the final step is completed. */
  readonly onDone?: () => void;
  /** Called when the skip button is pressed. The button is omitted when absent. */
  readonly onSkip?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  carousel: { flex: 1 },
  page: { flex: 1, justifyContent: 'center' },
  illustration: { alignItems: 'center' },
});

interface PageProps {
  readonly step: WalkthroughStep;
}

const StepPageImpl = React.forwardRef<View, PageProps>(function StepPage(props, ref) {
  const { step } = props;
  return (
    <View ref={ref} style={staticStyles.page}>
      <VStack gap="lg">
        {step.illustration ? (
          <View style={staticStyles.illustration}>{step.illustration}</View>
        ) : null}
        <VStack gap="sm">
          <Heading level={2} align="center">
            {step.title}
          </Heading>
          {step.body ? (
            <Text variant="body" tone="muted" align="center">
              {step.body}
            </Text>
          ) : null}
        </VStack>
      </VStack>
    </View>
  );
});
StepPageImpl.displayName = 'WalkthroughStepPage';
const StepPage = React.memo(StepPageImpl);

const WalkthroughScreensImpl = React.forwardRef<View, WalkthroughScreensProps>(
  function WalkthroughScreens(props, ref) {
    const {
      steps,
      doneLabel = 'Done',
      skipLabel = 'Skip',
      hint = 'Swipe to continue',
      onDone,
      onSkip,
      style,
    } = props;
    const [current, setCurrent] = React.useState(0);

    const lastIndex = steps.length - 1;
    const isLast = current >= lastIndex;

    const renderStep = React.useCallback((step: WalkthroughStep) => <StepPage step={step} />, []);

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper padding="lg">
          <Carousel
            items={steps}
            renderItem={renderStep}
            onPageChange={setCurrent}
            style={staticStyles.carousel}
          />
          <VStack gap="sm">
            {isLast ? (
              <Button tone="primary" fullWidth onPress={onDone}>
                {doneLabel}
              </Button>
            ) : (
              <Text variant="caption" tone="muted" align="center">
                {hint}
              </Text>
            )}
            {onSkip && !isLast ? (
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

WalkthroughScreensImpl.displayName = 'WalkthroughScreens';

/** Multi-step paged walkthrough: Carousel pages + page dots + next/done. */
export const WalkthroughScreens = React.memo(WalkthroughScreensImpl);
