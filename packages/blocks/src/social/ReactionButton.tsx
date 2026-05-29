import { Box, HStack, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

/** A selectable reaction. `label` is a plain text glyph/word — no emoji literals baked in. */
export interface ReactionOption {
  /** Stable identity. */
  readonly key: string;
  /** Display label, e.g. "Like" or a caller-supplied glyph. */
  readonly label: string;
}

export interface ReactionButtonProps {
  /** Available reactions to choose from. */
  readonly reactions: readonly ReactionOption[];
  /** Currently selected reaction key. */
  readonly value?: string;
  /** Called with the chosen reaction key (or the same key to clear, caller decides). */
  readonly onReact?: (key: string) => void;
  /** Trigger label shown when nothing is selected. Defaults to "React". */
  readonly triggerLabel?: string;
  /** Disable interaction. */
  readonly disabled?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  trigger: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pickerRow: { flexWrap: 'wrap' },
  option: { borderRadius: 999 },
});

interface ReactionChipProps {
  readonly option: ReactionOption;
  readonly selected: boolean;
  readonly onPress: (key: string) => void;
}

const ReactionChip = React.memo(function ReactionChip({
  option,
  selected,
  onPress,
}: ReactionChipProps) {
  const tokens = useTokens();
  const handlePress = React.useCallback(() => onPress(option.key), [onPress, option.key]);

  const chipStyle: ViewStyle = {
    paddingHorizontal: tokens.space.xs,
    paddingVertical: tokens.space['3xs'],
    backgroundColor: selected ? tokens.colors.action.primary : tokens.colors.background.subtle,
  };
  const labelStyle: TextStyle = {
    color: selected ? tokens.colors.text.onAccent : tokens.colors.text.primary,
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={option.label}
      hitSlop={4}
      onPress={handlePress}
      style={[staticStyles.option, chipStyle]}
    >
      <Text variant="bodySm" weight="medium" style={labelStyle}>
        {option.label}
      </Text>
    </Pressable>
  );
});

const ReactionButtonImpl = React.forwardRef<View, ReactionButtonProps>(
  function ReactionButton(props, ref) {
    const { reactions, value, onReact, triggerLabel = 'React', disabled = false, style } = props;
    const tokens = useTokens();
    const [open, setOpen] = React.useState(false);

    const selected = React.useMemo(
      () => reactions.find((r) => r.key === value),
      [reactions, value],
    );

    const toggleOpen = React.useCallback(() => {
      if (!disabled) setOpen((prev) => !prev);
    }, [disabled]);

    const handleReact = React.useCallback(
      (key: string) => {
        onReact?.(key);
        setOpen(false);
      },
      [onReact],
    );

    const triggerColor: TextStyle = {
      color: selected ? tokens.colors.action.primary : tokens.colors.text.secondary,
    };
    const disabledStyle: ViewStyle = disabled ? { opacity: 0.5 } : EMPTY;

    return (
      <Box ref={ref} style={style}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ expanded: open, disabled }}
          accessibilityLabel={selected ? `Reaction: ${selected.label}` : triggerLabel}
          hitSlop={8}
          disabled={disabled || !onReact}
          onPress={toggleOpen}
          style={[staticStyles.trigger, disabledStyle]}
        >
          <Text variant="bodySm" weight="medium" style={triggerColor}>
            {selected ? selected.label : triggerLabel}
          </Text>
        </Pressable>
        {open ? (
          <HStack gap="xs" style={staticStyles.pickerRow}>
            {reactions.map((reaction) => (
              <ReactionChip
                key={reaction.key}
                option={reaction}
                selected={reaction.key === value}
                onPress={handleReact}
              />
            ))}
          </HStack>
        ) : null}
      </Box>
    );
  },
);

const EMPTY: ViewStyle = {};

ReactionButtonImpl.displayName = 'ReactionButton';

export const ReactionButton = React.memo(ReactionButtonImpl);
