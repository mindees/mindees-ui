import * as React from 'react';
import { Pressable, View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface RatingProps {
  /** Current value (0..max). */
  readonly value: number;
  readonly max?: number;
  readonly onChange?: (next: number) => void;
  readonly readOnly?: boolean;
  readonly size?: number;
}

const RatingImpl = React.forwardRef<View, RatingProps>(function Rating(props, ref) {
  const { value, max = 5, onChange, readOnly = false, size = 20 } = props;
  const tokens = useTokens();
  const filled = tokens.colors.status.warning;
  const empty = tokens.colors.border.default;

  return (
    <View
      ref={ref}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: 0, max, now: value }}
      style={{ flexDirection: 'row', gap: 2 }}
    >
      {Array.from({ length: max }).map((_, i) => {
        const star = i < value;
        const node = (
          <Text
            accessibilityElementsHidden
            style={{ fontSize: size, color: star ? filled : empty, lineHeight: size + 2 }}
          >
            ★
          </Text>
        );
        if (readOnly) return <View key={i}>{node}</View>;
        return (
          <Pressable
            key={i}
            accessibilityRole="button"
            accessibilityLabel={`Rate ${i + 1} of ${max}`}
            onPress={() => onChange?.(i + 1)}
            hitSlop={4}
          >
            {node}
          </Pressable>
        );
      })}
    </View>
  );
});

RatingImpl.displayName = 'Rating';

export const Rating = tagComponent(RatingImpl, 'Rating');
