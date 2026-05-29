import { HStack, IconButton, Input, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

export interface MessageComposerProps {
  /** Called with the trimmed message text when send is pressed. */
  readonly onSend: (text: string) => void;
  /** Optional attach handler — shows an attach button when provided. */
  readonly onAttach?: () => void;
  /** Input placeholder. Defaults to "Message". */
  readonly placeholder?: string;
  /** Disable the whole composer. */
  readonly disabled?: boolean;
  /** Accessible label for the send button. Defaults to "Send message". */
  readonly sendLabel?: string;
  /** Accessible label for the attach button. Defaults to "Add attachment". */
  readonly attachLabel?: string;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const SEND_GLYPH = '➤'; // arrow
const ATTACH_GLYPH = '+';

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
});

const MessageComposerImpl = React.forwardRef<View, MessageComposerProps>(
  function MessageComposer(props, ref) {
    const {
      onSend,
      onAttach,
      placeholder = 'Message',
      disabled = false,
      sendLabel = 'Send message',
      attachLabel = 'Add attachment',
      style,
    } = props;
    const tokens = useTokens();
    const [text, setText] = React.useState('');

    const trimmed = text.trim();
    const canSend = trimmed.length > 0 && !disabled;

    const handleSend = React.useCallback(() => {
      const value = text.trim();
      if (value.length === 0) return;
      onSend(value);
      setText('');
    }, [text, onSend]);

    const sendColor: TextStyle = {
      color: canSend ? tokens.colors.text.onAccent : tokens.colors.text.muted,
    };
    const attachColor: TextStyle = { color: tokens.colors.text.primary };

    return (
      <HStack ref={ref} gap="xs" align="center" style={style}>
        {onAttach ? (
          <IconButton
            accessibilityLabel={attachLabel}
            onPress={onAttach}
            disabled={disabled}
            tone="neutral"
          >
            <Text variant="bodyLg" style={attachColor}>
              {ATTACH_GLYPH}
            </Text>
          </IconButton>
        ) : null}
        <Input
          style={staticStyles.grow}
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          disabled={disabled}
          multiline
          accessibilityLabel={placeholder}
          onSubmitEditing={handleSend}
          returnKeyType="send"
          blurOnSubmit={false}
        />
        <IconButton
          accessibilityLabel={sendLabel}
          onPress={handleSend}
          disabled={!canSend}
          variant="solid"
          tone="primary"
        >
          <Text variant="body" style={sendColor}>
            {SEND_GLYPH}
          </Text>
        </IconButton>
      </HStack>
    );
  },
);

MessageComposerImpl.displayName = 'MessageComposer';

export const MessageComposer = React.memo(MessageComposerImpl);
