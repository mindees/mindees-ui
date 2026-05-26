import * as React from 'react';
import { Linking, Pressable, type Text as RNText } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export interface LinkProps extends Omit<TextProps, 'tone' | 'underline'> {
  /** External URL. When set, tapping opens it via `Linking.openURL`. */
  readonly href?: string;
  /** Called *before* the URL is opened (or instead of, if `onPress` calls `preventDefault`). */
  readonly onPress?: () => void;
  /** Hide the default underline. */
  readonly hideUnderline?: boolean;
}

const LinkImpl = React.forwardRef<RNText, LinkProps>(function Link(props, _ref) {
  const { href, onPress, hideUnderline, children, accessibilityRole = 'link', ...rest } = props;

  const handlePress = React.useCallback(() => {
    onPress?.();
    if (href) {
      // Linking.openURL rejects with an error on unsupported URLs; swallow
      // since the user-facing failure mode (nothing happens) is the right one
      // when the host platform can't resolve the scheme.
      Linking.openURL(href).catch(() => undefined);
    }
  }, [href, onPress]);

  return (
    <Pressable onPress={handlePress} accessibilityRole={accessibilityRole}>
      <Text tone="link" underline={!hideUnderline} {...rest}>
        {children}
      </Text>
    </Pressable>
  );
});

LinkImpl.displayName = 'Link';

export const Link = tagComponent(LinkImpl, 'Link');
