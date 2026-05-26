import * as React from 'react';
import {
  Animated,
  Easing,
  Pressable,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';

import { resolveShadow } from '@mindees/tokens';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useReduceMotion, useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export type PillTabBarVariant = 'segmented' | 'floating' | 'dock' | 'glass';

export interface PillTabItem {
  readonly value: string;
  readonly label?: string;
  /** Icon node rendered above (dock) or before (other variants) the label. */
  readonly icon?: React.ReactNode;
  /** Optional badge count or string — appears as a small dot when omitted. */
  readonly badge?: string | number;
}

export interface PillTabBarProps {
  readonly items: readonly PillTabItem[];
  readonly value: string;
  readonly onValueChange: (next: string) => void;
  /**
   * Visual style for 2026-era pill tab bars:
   *
   * - `segmented` — single rounded container with a sliding pill behind the
   *   active tab. Apple-style segmented control.
   * - `floating` — capsule container with individual pill items; active
   *   item gets a solid background. Material-You-ish.
   * - `dock` — bottom navigation bar; active item gets a rounded coloured
   *   pill plus elevated icon.
   * - `glass` — translucent floating bar with a soft border + shadow.
   *   No blur peer required.
   */
  readonly variant?: PillTabBarVariant;
  /** Override the accent colour. Defaults to `theme.colors.action.primary`. */
  readonly accent?: string;
  readonly size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<
  NonNullable<PillTabBarProps['size']>,
  { padY: number; padX: number; font: 'caption' | 'bodySm' | 'body' }
> = {
  sm: { padY: 6, padX: 12, font: 'caption' },
  md: { padY: 10, padX: 16, font: 'bodySm' },
  lg: { padY: 14, padX: 20, font: 'body' },
};

const PillTabBarImpl = React.forwardRef<View, PillTabBarProps>(function PillTabBar(props, ref) {
  const { items, value, onValueChange, variant = 'segmented', accent, size = 'md' } = props;
  const tokens = useTokens();
  const reduceMotion = useReduceMotion();
  const accentColor = accent ?? tokens.colors.action.primary;
  const sizing = SIZE_MAP[size];

  if (variant === 'segmented') {
    return (
      <Segmented
        ref={ref}
        items={items}
        value={value}
        onValueChange={onValueChange}
        accent={accentColor}
        sizing={sizing}
        reduceMotion={reduceMotion}
        tokens={tokens}
      />
    );
  }

  if (variant === 'dock') {
    return (
      <Dock
        ref={ref}
        items={items}
        value={value}
        onValueChange={onValueChange}
        accent={accentColor}
        sizing={sizing}
        tokens={tokens}
      />
    );
  }

  // floating + glass share most structure; only the container chrome differs.
  return (
    <Floating
      ref={ref}
      items={items}
      value={value}
      onValueChange={onValueChange}
      accent={accentColor}
      sizing={sizing}
      tokens={tokens}
      glass={variant === 'glass'}
    />
  );
});

PillTabBarImpl.displayName = 'PillTabBar';

export const PillTabBar = tagComponent(PillTabBarImpl, 'PillTabBar');

// ---------- Variants -----------------------------------------------------

interface VariantProps {
  readonly items: readonly PillTabItem[];
  readonly value: string;
  readonly onValueChange: (next: string) => void;
  readonly accent: string;
  readonly sizing: (typeof SIZE_MAP)[keyof typeof SIZE_MAP];
  readonly tokens: ReturnType<typeof useTokens>;
}

const Segmented = React.forwardRef<View, VariantProps & { readonly reduceMotion: boolean }>(
  function Segmented(props, ref) {
    // `accent` is unused in segmented (the sliding pill uses surface, not accent);
    // ignored on purpose via underscore prefix to satisfy noUnusedLocals.
    const { items, value, onValueChange, accent: _accent, sizing, tokens, reduceMotion } = props;
    const [widths, setWidths] = React.useState<number[]>(() => items.map(() => 0));
    const slide = React.useRef(new Animated.Value(0)).current;

    const activeIndex = items.findIndex((i) => i.value === value);
    const accumulated = widths.slice(0, activeIndex).reduce((a, b) => a + b, 0);

    React.useEffect(() => {
      if (reduceMotion) {
        slide.setValue(accumulated);
        return;
      }
      Animated.timing(slide, {
        toValue: accumulated,
        duration: tokens.duration.base,
        easing: Easing.bezier(...tokens.easing.emphasised),
        useNativeDriver: false,
      }).start();
    }, [accumulated, reduceMotion, slide, tokens.duration.base, tokens.easing.emphasised]);

    const trackStyle: ViewStyle = {
      flexDirection: 'row',
      backgroundColor: tokens.colors.background.subtle,
      borderRadius: tokens.radii.pill,
      padding: 4,
      position: 'relative',
      alignSelf: 'flex-start',
    };

    const activeWidth = widths[activeIndex] ?? 0;

    return (
      <View ref={ref} accessibilityRole="tablist" style={trackStyle}>
        <Animated.View
          pointerEvents="none"
          style={{
            position: 'absolute',
            top: 4,
            bottom: 4,
            left: slide,
            width: activeWidth,
            backgroundColor: tokens.colors.background.elevated,
            borderRadius: tokens.radii.pill,
            ...resolveShadow('sm'),
          }}
        />
        {items.map((item, i) => (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: item.value === value }}
            onPress={() => onValueChange(item.value)}
            onLayout={(e: LayoutChangeEvent) =>
              setWidths((prev) => {
                const next = [...prev];
                next[i] = e.nativeEvent.layout.width;
                return next;
              })
            }
            style={{
              paddingVertical: sizing.padY,
              paddingHorizontal: sizing.padX,
              zIndex: 1,
            }}
          >
            {item.label ? (
              <Text
                variant={sizing.font}
                weight={item.value === value ? 'semibold' : 'regular'}
                tone={item.value === value ? 'primary' : 'secondary'}
              >
                {item.label}
              </Text>
            ) : (
              item.icon
            )}
          </Pressable>
        ))}
      </View>
    );
  },
);

const Floating = React.forwardRef<View, VariantProps & { readonly glass: boolean }>(
  function Floating(props, ref) {
    const { items, value, onValueChange, accent, sizing, tokens, glass } = props;
    const containerStyle: ViewStyle = {
      flexDirection: 'row',
      gap: 4,
      padding: 4,
      backgroundColor: glass ? tokens.colors.background.surface : tokens.colors.background.elevated,
      borderRadius: tokens.radii.pill,
      borderWidth: glass ? 1 : 0,
      borderColor: tokens.colors.border.subtle,
      alignSelf: 'flex-start',
      ...resolveShadow(glass ? 'md' : 'sm'),
    };
    return (
      <View ref={ref} accessibilityRole="tablist" style={containerStyle}>
        {items.map((item) => {
          const active = item.value === value;
          return (
            <Pressable
              key={item.value}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              onPress={() => onValueChange(item.value)}
              style={{
                paddingVertical: sizing.padY,
                paddingHorizontal: sizing.padX,
                borderRadius: tokens.radii.pill,
                backgroundColor: active ? accent : 'transparent',
                flexDirection: 'row',
                alignItems: 'center',
                gap: tokens.space['2xs'],
              }}
            >
              {item.icon}
              {item.label ? (
                <Text
                  variant={sizing.font}
                  weight="semibold"
                  style={{
                    color: active ? tokens.colors.text.onAccent : tokens.colors.text.primary,
                  }}
                >
                  {item.label}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    );
  },
);

const Dock = React.forwardRef<View, VariantProps>(function Dock(props, ref) {
  const { items, value, onValueChange, accent, sizing, tokens } = props;
  const dockStyle: ViewStyle = {
    flexDirection: 'row',
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.xs,
    backgroundColor: tokens.colors.background.elevated,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border.subtle,
    justifyContent: 'space-around',
  };
  return (
    <View ref={ref} accessibilityRole="tablist" style={dockStyle}>
      {items.map((item) => {
        const active = item.value === value;
        return (
          <Pressable
            key={item.value}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
            onPress={() => onValueChange(item.value)}
            style={{
              alignItems: 'center',
              paddingHorizontal: sizing.padX,
              paddingVertical: sizing.padY / 2,
              borderRadius: tokens.radii.pill,
              backgroundColor: active ? accent : 'transparent',
              minWidth: 56,
            }}
          >
            {item.icon}
            {item.label ? (
              <Text
                variant="caption"
                weight={active ? 'semibold' : 'regular'}
                style={{ color: active ? tokens.colors.text.onAccent : tokens.colors.text.muted }}
              >
                {item.label}
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
});
