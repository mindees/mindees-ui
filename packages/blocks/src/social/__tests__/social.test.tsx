import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';

import {
  ChatBubble,
  ChatList,
  CommentBox,
  CommentsList,
  FollowButton,
  LikeButton,
  MessageComposer,
  NotificationItem,
  ReactionButton,
  ReadReceipt,
  ReportContentModal,
  TypingIndicator,
  VoiceMessage,
  type Comment,
  type Conversation,
  type NotificationData,
  type ReactionOption,
  type ReadReceiptStatus,
  type ReportReason,
} from '../index';

// Stable noop avoids eslint's empty-function rule firing for inline arrows.
const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const conversations: Conversation[] = [
  {
    id: 'c1',
    name: 'Avery Stone',
    lastMessage: 'See you at 9!',
    time: '09:41',
    avatar: 'https://example.com/avery.jpg',
    unreadCount: 3,
  },
  { id: 'c2', name: 'Design Team', lastMessage: 'Shipped the update.', time: 'Mon' },
];

const notification: NotificationData = {
  id: 'n1',
  text: 'Avery started following you.',
  time: '2h',
  name: 'Avery Stone',
  unread: true,
};

const comments: Comment[] = [
  { id: 'm1', author: 'Avery', text: 'Love this!', time: '2h', liked: true, likeCount: 4 },
  { id: 'm2', author: 'Sam', text: 'Agreed.', time: '1h', likeCount: 0 },
];

const reactions: ReactionOption[] = [
  { key: 'like', label: 'Like' },
  { key: 'love', label: 'Love' },
  { key: 'haha', label: 'Haha' },
];

const reasons: ReportReason[] = [
  { key: 'spam', label: 'Spam or misleading' },
  { key: 'abuse', label: 'Harassment or abuse' },
  { key: 'other', label: 'Something else' },
];

const receiptStatuses: ReadReceiptStatus[] = ['sending', 'sent', 'delivered', 'read', 'failed'];

describe('social blocks — render without throwing', () => {
  it('renders ChatList', () => {
    expect(() =>
      renderWithTheme(<ChatList conversations={conversations} onPressConversation={noop} />),
    ).not.toThrow();
  });

  it('renders ChatList (empty, no handler)', () => {
    expect(() => renderWithTheme(<ChatList conversations={[]} />)).not.toThrow();
  });

  it('renders ChatBubble (mine, with status + time)', () => {
    expect(() =>
      renderWithTheme(<ChatBubble text="On my way" mine time="09:41" status="read" />),
    ).not.toThrow();
  });

  it('renders ChatBubble (theirs, minimal)', () => {
    expect(() => renderWithTheme(<ChatBubble text="Hello" />)).not.toThrow();
  });

  it('renders MessageComposer (with attach)', () => {
    expect(() => renderWithTheme(<MessageComposer onSend={noop} onAttach={noop} />)).not.toThrow();
  });

  it('renders MessageComposer (no attach, disabled)', () => {
    expect(() =>
      renderWithTheme(<MessageComposer onSend={noop} disabled placeholder="Say something" />),
    ).not.toThrow();
  });

  it('renders VoiceMessage (playing + progress)', () => {
    expect(() =>
      renderWithTheme(<VoiceMessage duration="0:42" playing progress={0.4} onTogglePlay={noop} />),
    ).not.toThrow();
  });

  it('renders VoiceMessage (idle, no handler)', () => {
    expect(() => renderWithTheme(<VoiceMessage duration="1:05" />)).not.toThrow();
  });

  it('renders TypingIndicator (named and anonymous)', () => {
    expect(() => renderWithTheme(<TypingIndicator name="Avery" />)).not.toThrow();
    expect(() => renderWithTheme(<TypingIndicator />)).not.toThrow();
  });

  it('renders ReadReceipt (every status)', () => {
    for (const status of receiptStatuses) {
      expect(() => renderWithTheme(<ReadReceipt status={status} />)).not.toThrow();
    }
  });

  it('renders NotificationItem (unread, pressable)', () => {
    expect(() =>
      renderWithTheme(<NotificationItem notification={notification} onPress={noop} />),
    ).not.toThrow();
  });

  it('renders NotificationItem (read, no handler)', () => {
    expect(() =>
      renderWithTheme(<NotificationItem notification={{ id: 'n2', text: 'Liked your post.' }} />),
    ).not.toThrow();
  });

  it('renders CommentBox', () => {
    expect(() =>
      renderWithTheme(<CommentBox onPost={noop} avatarUri="x" name="Avery" />),
    ).not.toThrow();
  });

  it('renders CommentBox (disabled, minimal)', () => {
    expect(() => renderWithTheme(<CommentBox onPost={noop} disabled />)).not.toThrow();
  });

  it('renders CommentsList', () => {
    expect(() => renderWithTheme(<CommentsList comments={comments} onLike={noop} />)).not.toThrow();
  });

  it('renders CommentsList (empty, no like handler)', () => {
    expect(() => renderWithTheme(<CommentsList comments={[]} />)).not.toThrow();
  });

  it('renders LikeButton (liked with count and unliked)', () => {
    expect(() => renderWithTheme(<LikeButton liked count={12} onToggle={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<LikeButton />)).not.toThrow();
  });

  it('renders ReactionButton (selected and unselected)', () => {
    expect(() =>
      renderWithTheme(<ReactionButton reactions={reactions} value="love" onReact={noop} />),
    ).not.toThrow();
    expect(() => renderWithTheme(<ReactionButton reactions={reactions} />)).not.toThrow();
  });

  it('renders FollowButton (all states)', () => {
    expect(() => renderWithTheme(<FollowButton onToggle={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<FollowButton following onToggle={noop} />)).not.toThrow();
    expect(() => renderWithTheme(<FollowButton loading onToggle={noop} />)).not.toThrow();
  });

  it('renders ReportContentModal (closed)', () => {
    expect(() =>
      renderWithTheme(
        <ReportContentModal visible={false} reasons={reasons} onSubmit={noop} onClose={noop} />,
      ),
    ).not.toThrow();
  });
});
