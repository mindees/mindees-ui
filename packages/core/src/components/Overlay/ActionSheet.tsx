import * as React from 'react';
import { Pressable, type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';
import { BottomSheet } from './BottomSheet';

export interface ActionSheetItem {
  readonly label: string;
  readonly destructive?: boolean;
  readonly onPress: () => void;
}

export interface ActionSheetProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly items: readonly ActionSheetItem[];
  /** Show a "Cancel" row that just calls `onClose`. Default true. */
  readonly showCancel?: boolean;
  /** Style applied to the elevated sheet surface (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

const ActionSheetImpl = React.forwardRef<View, ActionSheetProps>(function ActionSheet(props, ref) {
  const { visible, onClose, title, items, showCancel = true, style } = props;
  const tokens = useTokens();

  const rowStyle: ViewStyle = {
    paddingVertical: tokens.space.md,
    minHeight: 44,
    justifyContent: 'center',
  };

  return (
    <BottomSheet ref={ref} visible={visible} onClose={onClose} height="auto" style={style}>
      <Stack gap="2xs">
        {title ? (
          <Text variant="caption" tone="muted">
            {title}
          </Text>
        ) : null}
        {items.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              item.onPress();
              onClose();
            }}
            accessibilityRole="button"
            style={rowStyle}
          >
            <Text tone={item.destructive ? 'danger' : 'primary'}>{item.label}</Text>
          </Pressable>
        ))}
        {showCancel ? (
          <Pressable onPress={onClose} accessibilityRole="button" style={rowStyle}>
            <Text tone="link">Cancel</Text>
          </Pressable>
        ) : null}
      </Stack>
    </BottomSheet>
  );
});

ActionSheetImpl.displayName = 'ActionSheet';

export const ActionSheet = tagComponent(ActionSheetImpl, 'ActionSheet');
