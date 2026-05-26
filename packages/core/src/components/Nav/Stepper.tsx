import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { CheckIcon } from '@mindees/icons';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface StepperStep {
  readonly title: string;
  readonly description?: string;
}

export interface StepperProps {
  readonly steps: readonly StepperStep[];
  readonly current: number;
  readonly orientation?: 'horizontal' | 'vertical';
}

const StepperImpl = React.forwardRef<View, StepperProps>(function Stepper(props, ref) {
  const { steps, current, orientation = 'horizontal' } = props;
  const tokens = useTokens();
  const containerStyle: ViewStyle =
    orientation === 'horizontal'
      ? { flexDirection: 'row', alignItems: 'flex-start', gap: tokens.space.sm }
      : { flexDirection: 'column', gap: tokens.space.sm };

  return (
    <View ref={ref} accessibilityRole="none" style={containerStyle}>
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        const dotBg = done
          ? tokens.colors.status.success
          : active
            ? tokens.colors.action.primary
            : tokens.colors.background.subtle;
        const dotText = done || active ? tokens.colors.text.onAccent : tokens.colors.text.muted;
        return (
          <View
            key={`${step.title}-${i}`}
            style={{
              flexDirection: orientation === 'horizontal' ? 'column' : 'row',
              alignItems: orientation === 'horizontal' ? 'center' : 'flex-start',
              gap: tokens.space['2xs'],
              flex: orientation === 'horizontal' ? 1 : undefined,
            }}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: dotBg,
              }}
            >
              {done ? (
                <CheckIcon size={16} color={dotText} />
              ) : (
                <Text tone="onAccent" weight="bold" style={{ color: dotText }}>
                  {i + 1}
                </Text>
              )}
            </View>
            <View style={{ alignItems: orientation === 'horizontal' ? 'center' : 'flex-start' }}>
              <Text
                variant="label"
                weight={active ? 'semibold' : 'regular'}
                tone={active ? 'primary' : 'secondary'}
              >
                {step.title}
              </Text>
              {step.description ? (
                <Text variant="caption" tone="muted">
                  {step.description}
                </Text>
              ) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
});

StepperImpl.displayName = 'Stepper';

export const Stepper = tagComponent(StepperImpl, 'Stepper');
