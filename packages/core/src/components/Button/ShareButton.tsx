import * as React from 'react';
import { Share, type ShareAction, type ShareContent, type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Button, type ButtonBaseProps } from './Button';
import { GlyphAffordance } from './internal/GlyphAffordance';

export interface ShareButtonProps extends Omit<ButtonBaseProps, 'children' | 'onPress'> {
  /** Text body to share. At least one of `message` or `url` is required. */
  readonly message?: string;
  /** URL to share. At least one of `message` or `url` is required. */
  readonly url?: string;
  /** Optional share dialog title (Android). */
  readonly title?: string;
  /** Resolves with the platform share result, or rejects if the sheet errored. */
  readonly onShared?: (result: ShareAction) => void;
  /** Label text. Defaults to "Share". */
  readonly children?: React.ReactNode;
}

const ShareButtonImpl = React.forwardRef<View, ShareButtonProps>(function ShareButton(props, ref) {
  const {
    message,
    url,
    title,
    onShared,
    children = 'Share',
    leading,
    variant,
    tone,
    size,
    ...rest
  } = props;

  const handlePress = React.useCallback(() => {
    // Share.share requires at least a message or url; bail out otherwise.
    if (message === undefined && url === undefined) return;
    const content: ShareContent =
      message !== undefined ? { title, url, message } : { title, url: url ?? '' };
    Share.share(content)
      .then((result) => {
        if (onShared) onShared(result);
      })
      .catch(() => {
        // Swallow: user dismissal / unsupported platform should not crash callers.
      });
  }, [message, url, title, onShared]);

  return (
    <Button
      ref={ref}
      onPress={handlePress}
      variant={variant}
      tone={tone}
      size={size}
      leading={leading ?? <GlyphAffordance glyph="↗" variant={variant} tone={tone} size={size} />}
      {...rest}
    >
      {children}
    </Button>
  );
});

ShareButtonImpl.displayName = 'ShareButton';

export const ShareButton = tagComponent(React.memo(ShareButtonImpl), 'ShareButton');
