import { CheckIcon } from '@mindees/icons';
import { space } from '@mindees/tokens';
import {
  Box,
  Button,
  Card,
  Heading,
  HStack,
  PillTabBar,
  ScreenWrapper,
  Text,
  TopBar,
  useTokens,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface PricingPlan {
  /** Plan name, e.g. "Pro". */
  readonly name: string;
  /** Pre-formatted price, e.g. "$12". */
  readonly price: string;
  /** Pre-formatted billing period suffix, e.g. "/mo". */
  readonly period?: string;
  /** Feature bullet list. */
  readonly features: readonly string[];
  /** CTA label. Defaults to "Choose plan". */
  readonly cta?: string;
  /** Visually emphasises this plan as the recommended tier. */
  readonly highlighted?: boolean;
}

/** Identifier for the active billing cycle in the optional toggle. */
export type BillingCycle = 'monthly' | 'annual';

export interface PricingScreenProps {
  /** Pricing tiers rendered as feature cards. */
  readonly plans: readonly PricingPlan[];
  /** Header title. Defaults to "Pricing". */
  readonly title?: string;
  /** When true, shows a monthly/annual segmented toggle above the plans. */
  readonly showBillingToggle?: boolean;
  /** Initial billing cycle when the toggle is shown. Defaults to "monthly". */
  readonly defaultCycle?: BillingCycle;
  /** Called when the billing cycle changes. */
  readonly onChangeCycle?: (cycle: BillingCycle) => void;
  /** Called with the plan name when a plan CTA is pressed. */
  readonly onSelectPlan?: (name: string) => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, padding: space.md },
  toggle: { alignSelf: 'center' },
  cta: { alignSelf: 'stretch' },
});

const CYCLE_ITEMS = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
] as const;

interface PlanCardProps {
  readonly plan: PricingPlan;
  readonly onSelect?: (name: string) => void;
}

const PlanCardImpl = React.forwardRef<View, PlanCardProps>(function PlanCard(props, ref) {
  const { plan, onSelect } = props;
  const tokens = useTokens();
  const handlePress = React.useCallback(() => onSelect?.(plan.name), [onSelect, plan.name]);

  const highlightStyle = React.useMemo<ViewStyle | undefined>(
    () =>
      plan.highlighted ? { borderWidth: 2, borderColor: tokens.colors.action.primary } : undefined,
    [plan.highlighted, tokens],
  );

  return (
    <Card ref={ref} variant={plan.highlighted ? 'elevated' : 'outlined'} style={highlightStyle}>
      <VStack gap="md">
        <VStack gap="3xs">
          <Heading level={4}>{plan.name}</Heading>
          <HStack gap="2xs" align="end">
            <Heading level={2}>{plan.price}</Heading>
            {plan.period ? (
              <Text variant="bodySm" tone="muted">
                {plan.period}
              </Text>
            ) : null}
          </HStack>
        </VStack>

        <VStack gap="2xs">
          {plan.features.map((feature) => (
            <HStack key={feature} gap="xs" align="center">
              <CheckIcon size={16} color={tokens.colors.status.success} />
              <Text variant="bodySm" tone="secondary">
                {feature}
              </Text>
            </HStack>
          ))}
        </VStack>

        <Button
          variant={plan.highlighted ? 'solid' : 'outline'}
          tone={plan.highlighted ? 'primary' : 'neutral'}
          fullWidth
          onPress={handlePress}
          style={staticStyles.cta}
        >
          {plan.cta ?? 'Choose plan'}
        </Button>
      </VStack>
    </Card>
  );
});
PlanCardImpl.displayName = 'PricingPlanCard';
const PlanCard = React.memo(PlanCardImpl);

const PricingScreenImpl = React.forwardRef<View, PricingScreenProps>(
  function PricingScreen(props, ref) {
    const {
      plans,
      title = 'Pricing',
      showBillingToggle = false,
      defaultCycle = 'monthly',
      onChangeCycle,
      onSelectPlan,
      style,
    } = props;
    const [cycle, setCycle] = React.useState<BillingCycle>(defaultCycle);

    const handleCycleChange = React.useCallback(
      (next: string) => {
        const value = next === 'annual' ? 'annual' : 'monthly';
        setCycle(value);
        onChangeCycle?.(value);
      },
      [onChangeCycle],
    );

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          <TopBar title={title} />
          <ScrollView contentContainerStyle={staticStyles.content}>
            <VStack gap="lg">
              {showBillingToggle ? (
                <PillTabBar
                  items={CYCLE_ITEMS}
                  value={cycle}
                  onValueChange={handleCycleChange}
                  style={staticStyles.toggle}
                />
              ) : null}
              {plans.map((plan) => (
                <PlanCard key={plan.name} plan={plan} onSelect={onSelectPlan} />
              ))}
            </VStack>
          </ScrollView>
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

PricingScreenImpl.displayName = 'PricingScreen';

/** Pricing screen: tier cards with features + CTA + optional billing toggle. */
export const PricingScreen = React.memo(PricingScreenImpl);
