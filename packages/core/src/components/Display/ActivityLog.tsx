import * as React from 'react';
import { View, type StyleProp, type TextStyle, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface ActivityLogEvent {
  /** Short timestamp / time label shown on the left. */
  readonly time: string;
  readonly text: React.ReactNode;
  /** Optional leading icon node. */
  readonly icon?: React.ReactNode;
}

export interface ActivityLogProps extends Omit<ViewProps, 'style'> {
  readonly items: readonly ActivityLogEvent[];
  /** Fixed width of the left time column in px. Defaults to 64. */
  readonly timeWidth?: number;
  readonly style?: StyleProp<ViewStyle>;
}

const ROW_STYLE: ViewStyle = { flexDirection: 'row', alignItems: 'flex-start' };
const TEXT_COLUMN_STYLE: ViewStyle = { flex: 1 };
const ICON_WRAP_STYLE: ViewStyle = { alignItems: 'center', justifyContent: 'center' };

const ActivityLogImpl = React.forwardRef<View, ActivityLogProps>(function ActivityLog(props, ref) {
  const { items, timeWidth = 64, style, ...rest } = props;
  const tokens = useTokens();
  const rowStyle: ViewStyle = {
    ...ROW_STYLE,
    gap: tokens.space.sm,
    paddingVertical: tokens.space['2xs'],
  };
  const timeColumnStyle: TextStyle = { width: timeWidth };
  return (
    <View ref={ref} accessibilityRole="list" style={style} {...rest}>
      {items.map((item, i) => (
        <View key={i} accessibilityRole="none" style={rowStyle}>
          <Text variant="caption" tone="muted" style={timeColumnStyle}>
            {item.time}
          </Text>
          {item.icon ? <View style={ICON_WRAP_STYLE}>{item.icon}</View> : null}
          <View style={TEXT_COLUMN_STYLE}>
            {typeof item.text === 'string' ? (
              <Text variant="caption" tone="secondary">
                {item.text}
              </Text>
            ) : (
              item.text
            )}
          </View>
        </View>
      ))}
    </View>
  );
});

ActivityLogImpl.displayName = 'ActivityLog';

export const ActivityLog = tagComponent(ActivityLogImpl, 'ActivityLog');
