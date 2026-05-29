import { Box, Caption, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type TextStyle, View, type ViewStyle } from 'react-native';

/** Delivery state shown beneath an outgoing bubble. */
export type ChatBubbleStatus = 'sent' | 'delivered' | 'read';

export interface ChatBubbleProps {
  /** Message body text. */
  readonly text: string;
  /** When true the bubble aligns right and uses the accent surface (own message). */
  readonly mine?: boolean;
  /** Pre-formatted timestamp, e.g. "09:41". */
  readonly time?: string;
  /** Delivery status — only meaningful for own (`mine`) messages. */
  readonly status?: ChatBubbleStatus;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const STATUS_GLYPH: Record<ChatBubbleStatus, string> = {
  sent: '✓', // ✓
  delivered: '✓✓', // ✓✓
  read: '✓✓', // ✓✓ (colored)
};

const STATUS_LABEL: Record<ChatBubbleStatus, string> = {
  sent: 'Sent',
  delivered: 'Delivered',
  read: 'Read',
};

const staticStyles = StyleSheet.create({
  row: { width: '100%' },
  mine: { alignItems: 'flex-end' },
  theirs: { alignItems: 'flex-start' },
  bubble: { maxWidth: '80%' },
});

const ChatBubbleImpl = React.forwardRef<View, ChatBubbleProps>(function ChatBubble(props, ref) {
  const { text, mine = false, time, status, style } = props;
  const tokens = useTokens();

  const bubbleStyle: ViewStyle = {
    backgroundColor: mine ? tokens.colors.action.primary : tokens.colors.background.subtle,
    paddingHorizontal: tokens.space.sm,
    paddingVertical: tokens.space.xs,
    borderRadius: tokens.radii.lg,
    gap: tokens.space['3xs'],
  };

  const textColor: TextStyle = {
    color: mine ? tokens.colors.text.onAccent : tokens.colors.text.primary,
  };
  const metaColor: TextStyle = {
    color: mine ? tokens.colors.text.onAccent : tokens.colors.text.muted,
  };

  return (
    <View
      ref={ref}
      style={[staticStyles.row, mine ? staticStyles.mine : staticStyles.theirs, style]}
    >
      <Box style={[staticStyles.bubble, bubbleStyle]}>
        <Text style={textColor}>{text}</Text>
        {time || (mine && status) ? (
          <View style={META_ROW}>
            {time ? <Caption style={metaColor}>{time}</Caption> : null}
            {mine && status ? (
              <Caption
                style={[metaColor, status === 'read' ? READ_STATUS : undefined]}
                accessibilityLabel={STATUS_LABEL[status]}
              >
                {STATUS_GLYPH[status]}
              </Caption>
            ) : null}
          </View>
        ) : null}
      </Box>
    </View>
  );
});

const META_ROW: ViewStyle = { flexDirection: 'row', alignSelf: 'flex-end', gap: 4 };
const READ_STATUS: TextStyle = { fontWeight: '700' };

ChatBubbleImpl.displayName = 'ChatBubble';

export const ChatBubble = React.memo(ChatBubbleImpl);
