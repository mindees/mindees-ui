import { Avatar, Button, HStack, Input, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface CommentBoxProps {
  /** Called with the trimmed comment text when post is pressed. */
  readonly onPost: (text: string) => void;
  /** Optional avatar of the commenting user. */
  readonly avatarUri?: string;
  /** Display name for the avatar fallback initials. */
  readonly name?: string;
  /** Input placeholder. Defaults to "Add a comment…". */
  readonly placeholder?: string;
  /** Disable the whole box. */
  readonly disabled?: boolean;
  /** Post button label. Defaults to "Post". */
  readonly postLabel?: string;
  /** Style spread onto the root row. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  grow: { flex: 1 },
  post: { alignSelf: 'flex-end' },
});

const CommentBoxImpl = React.forwardRef<View, CommentBoxProps>(function CommentBox(props, ref) {
  const {
    onPost,
    avatarUri,
    name,
    placeholder = 'Add a comment…',
    disabled = false,
    postLabel = 'Post',
    style,
  } = props;
  const [text, setText] = React.useState('');

  const trimmed = text.trim();
  const canPost = trimmed.length > 0 && !disabled;

  const handlePost = React.useCallback(() => {
    const value = text.trim();
    if (value.length === 0) return;
    onPost(value);
    setText('');
  }, [text, onPost]);

  return (
    <HStack ref={ref} gap="sm" align="start" style={style}>
      <Avatar src={avatarUri} name={name} size="sm" />
      <VStack gap="xs" style={staticStyles.grow}>
        <Input
          value={text}
          onChangeText={setText}
          placeholder={placeholder}
          disabled={disabled}
          multiline
          accessibilityLabel={placeholder}
        />
        <Button
          variant="solid"
          tone="primary"
          size="sm"
          disabled={!canPost}
          onPress={handlePost}
          style={staticStyles.post}
        >
          {postLabel}
        </Button>
      </VStack>
    </HStack>
  );
});

CommentBoxImpl.displayName = 'CommentBox';

export const CommentBox = React.memo(CommentBoxImpl);
