import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface ProgressProps {
  /** 0–1. Omit / pass `null` for indeterminate. */
  readonly value?: number | null;
  readonly tone?: 'primary' | 'success' | 'warning' | 'danger';
  readonly height?: number;
}

const ProgressImpl = React.forwardRef<View, ProgressProps>(function Progress(props, ref) {
  const { value, tone = 'primary', height = 8 } = props;
  const tokens = useTokens();
  const clamped = value === null || value === undefined ? null : Math.min(1, Math.max(0, value));
  const accent =
    tone === 'success'
      ? tokens.colors.status.success
      : tone === 'warning'
        ? tokens.colors.status.warning
        : tone === 'danger'
          ? tokens.colors.status.danger
          : tokens.colors.action.primary;

  const trackStyle: ViewStyle = {
    height,
    backgroundColor: tokens.colors.background.subtle,
    borderRadius: height / 2,
    overflow: 'hidden',
  };
  const fillStyle: ViewStyle = {
    height: '100%',
    width: clamped === null ? '30%' : `${clamped * 100}%`,
    backgroundColor: accent,
  };

  return (
    <View
      ref={ref}
      accessibilityRole="progressbar"
      accessibilityValue={
        clamped === null
          ? { text: 'Loading' }
          : { now: Math.round(clamped * 100), min: 0, max: 100 }
      }
      style={trackStyle}
    >
      <View style={fillStyle} />
    </View>
  );
});

ProgressImpl.displayName = 'Progress';

export const Progress = tagComponent(ProgressImpl, 'Progress');
