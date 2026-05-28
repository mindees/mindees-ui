import * as React from 'react';
import { Pressable, type StyleProp, View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface FilePreviewProps {
  /** File name, shown as the card title. */
  readonly name: string;
  /**
   * Explicit type label (e.g. `PDF`, `PNG`). When omitted it is derived from
   * the file extension in `name`.
   */
  readonly type?: string;
  /** Size in bytes; rendered as a human-readable string when provided. */
  readonly size?: number;
  readonly onPress?: () => void;
  readonly accessibilityLabel?: string;
  readonly style?: StyleProp<ViewStyle>;
}

function deriveType(name: string, explicit?: string): string {
  if (explicit) return explicit.toUpperCase();
  const dot = name.lastIndexOf('.');
  if (dot <= 0 || dot === name.length - 1) return 'FILE';
  return name.slice(dot + 1).toUpperCase();
}

const SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '';
  if (bytes < 1024) return `${bytes} ${SIZE_UNITS[0]}`;
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < SIZE_UNITS.length - 1) {
    value /= 1024;
    unit += 1;
  }
  // One decimal place keeps the label compact while staying informative.
  return `${Math.round(value * 10) / 10} ${SIZE_UNITS[unit]}`;
}

const FilePreviewImpl = React.forwardRef<View, FilePreviewProps>(function FilePreview(props, ref) {
  const { name, type, size, onPress, accessibilityLabel, style, ...rest } = props;
  const tokens = useTokens();

  const typeLabel = deriveType(name, type);
  const sizeLabel = typeof size === 'number' ? formatSize(size) : '';

  const containerStyle = React.useMemo<ViewStyle>(
    () => ({
      flexDirection: 'row',
      alignItems: 'center',
      gap: tokens.space.sm,
      padding: tokens.space.sm,
      borderRadius: tokens.radii.md,
      borderWidth: 1,
      borderColor: tokens.colors.border.subtle,
      backgroundColor: tokens.colors.background.surface,
    }),
    [tokens],
  );

  const badgeStyle = React.useMemo<ViewStyle>(
    () => ({
      minWidth: 44,
      height: 44,
      paddingHorizontal: tokens.space['2xs'],
      borderRadius: tokens.radii.sm,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: tokens.colors.background.subtle,
    }),
    [tokens],
  );

  const metaStyle = React.useMemo<ViewStyle>(
    () => ({ flex: 1, gap: tokens.space['3xs'] }),
    [tokens],
  );

  const content = (
    <>
      <View
        style={badgeStyle}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      >
        <Text variant="caption" weight="bold" tone="secondary" numberOfLines={1}>
          {typeLabel}
        </Text>
      </View>
      <View style={metaStyle}>
        <Text variant="label" weight="medium" numberOfLines={1}>
          {name}
        </Text>
        {sizeLabel ? (
          <Text variant="caption" tone="muted">
            {sizeLabel}
          </Text>
        ) : null}
      </View>
    </>
  );

  const a11yLabel =
    accessibilityLabel ?? `${name}${sizeLabel ? `, ${sizeLabel}` : ''}, ${typeLabel} file`;

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        style={[containerStyle, style]}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref}
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
      style={[containerStyle, style]}
      {...rest}
    >
      {content}
    </View>
  );
});

FilePreviewImpl.displayName = 'FilePreview';

export const FilePreview = tagComponent(React.memo(FilePreviewImpl), 'FilePreview');
