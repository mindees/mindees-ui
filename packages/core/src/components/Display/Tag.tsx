import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';

import { CloseIcon } from '@mindees/icons';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface TagProps {
  readonly tone?: 'neutral' | 'primary' | 'success' | 'warning' | 'danger';
  readonly size?: 'sm' | 'md';
  readonly onPress?: () => void;
  readonly onRemove?: () => void;
  readonly children?: React.ReactNode;
}

const TagImpl = React.forwardRef<View, TagProps>(function Tag(props, ref) {
  const { tone = 'neutral', size = 'md', onPress, onRemove, children } = props;
  const tokens = useTokens();
  const subtle =
    tone === 'primary'
      ? tokens.colors.status.infoSubtle
      : tone === 'success'
        ? tokens.colors.status.successSubtle
        : tone === 'warning'
          ? tokens.colors.status.warningSubtle
          : tone === 'danger'
            ? tokens.colors.status.dangerSubtle
            : tokens.colors.background.subtle;
  const fg =
    tone === 'primary'
      ? tokens.colors.text.link
      : tone === 'success'
        ? tokens.colors.status.success
        : tone === 'warning'
          ? tokens.colors.status.warning
          : tone === 'danger'
            ? tokens.colors.status.danger
            : tokens.colors.text.primary;
  const style: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.space['3xs'],
    paddingHorizontal: size === 'sm' ? tokens.space.xs : tokens.space.sm,
    paddingVertical: size === 'sm' ? 2 : 4,
    backgroundColor: subtle,
    borderRadius: tokens.radii.md,
    alignSelf: 'flex-start',
  };
  const inner = (
    <>
      <Text variant={size === 'sm' ? 'caption' : 'label'} style={{ color: fg }}>
        {children}
      </Text>
      {onRemove ? (
        <Pressable
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Remove tag"
          hitSlop={8}
        >
          <CloseIcon size={12} color={fg} />
        </Pressable>
      ) : null}
    </>
  );
  if (onPress) {
    return (
      <Pressable ref={ref} onPress={onPress} accessibilityRole="button" style={style}>
        {inner}
      </Pressable>
    );
  }
  return (
    <View ref={ref} accessibilityRole="text" style={style}>
      {inner}
    </View>
  );
});

TagImpl.displayName = 'Tag';

export const Tag = tagComponent(TagImpl, 'Tag');

// Chip renders identical UI to Tag (some design systems prefer the name), but
// it is its OWN tagged component so the Layout Intelligence Layer can tell a
// Chip from a Tag. It must be a distinct instance — re-tagging the shared
// TagImpl would mutate Tag's tag too.
const ChipImpl = React.forwardRef<View, TagProps>(function Chip(props, ref) {
  return <TagImpl ref={ref} {...props} />;
});

ChipImpl.displayName = 'Chip';

export const Chip = tagComponent(ChipImpl, 'Chip');
