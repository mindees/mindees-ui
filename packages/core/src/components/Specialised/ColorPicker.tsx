import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

export interface ColorPickerProps {
  /** Hex colour strings. */
  readonly value?: string;
  readonly onChange?: (next: string) => void;
  /** Palette of selectable colours. Defaults to a token-derived 12-swatch ramp. */
  readonly swatches?: readonly string[];
  readonly size?: number;
}

const DEFAULT_SWATCHES = [
  '#000000',
  '#ffffff',
  '#ef4444',
  '#f97316',
  '#eab308',
  '#22c55e',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
  '#92400e',
];

/**
 * Minimum-deps swatch picker. For a full hue wheel use the optional peer
 * `@thebylito/react-native-wheel-color-picker` directly.
 */
const ColorPickerImpl = React.forwardRef<View, ColorPickerProps>(function ColorPicker(props, ref) {
  const { value, onChange, swatches = DEFAULT_SWATCHES, size = 32 } = props;
  const tokens = useTokens();
  return (
    <View
      ref={ref}
      accessibilityRole="none"
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: tokens.space['2xs'],
      }}
    >
      {swatches.map((color) => {
        const selected = color === value;
        const swatchStyle: ViewStyle = {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          borderWidth: selected ? 3 : 1,
          borderColor: selected ? tokens.colors.action.primary : tokens.colors.border.subtle,
        };
        return (
          <Pressable
            key={color}
            accessibilityRole="button"
            accessibilityLabel={`Choose colour ${color}`}
            accessibilityState={{ selected }}
            onPress={() => onChange?.(color)}
            style={swatchStyle}
          />
        );
      })}
    </View>
  );
});

ColorPickerImpl.displayName = 'ColorPicker';

export const ColorPicker = tagComponent(ColorPickerImpl, 'ColorPicker');
