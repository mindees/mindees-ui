import * as React from 'react';
import { Linking, Pressable, type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Text, type TextProps } from './Text';

export interface LinkProps extends Omit<TextProps, 'tone' | 'underline'> {
  /** External URL. When set, tapping opens it via `Linking.openURL`. */
  readonly href?: string;
  /** Called *before* the URL is opened (or instead of, if `onPress` calls `preventDefault`). */
  readonly onPress?: () => void;
  /** Hide the default underline. */
  readonly hideUnderline?: boolean;
  /** Style applied to the pressable wrapper. Caller value wins. */
  readonly wrapperStyle?: StyleProp<ViewStyle>;
}

const LinkImpl = React.forwardRef<View, LinkProps>(function Link(props, ref) {
  const {
    href,
    onPress,
    hideUnderline,
    children,
    accessibilityRole = 'link',
    wrapperStyle,
    ...rest
  } = props;

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
    <Pressable
      ref={ref}
      onPress={handlePress}
      accessibilityRole={accessibilityRole}
      style={wrapperStyle}
    >
      <Text tone="link" underline={!hideUnderline} {...rest}>
        {children}
      </Text>
    </Pressable>
  );
});

LinkImpl.displayName = 'Link';

export const Link = tagComponent(LinkImpl, 'Link');
