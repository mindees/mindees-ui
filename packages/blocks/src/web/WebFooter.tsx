import { Caption, Heading, useResponsive, useTokens, VStack } from '@mindees/ui';
import * as React from 'react';
import { Pressable, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

/** A footer link. */
export interface FooterLink {
  readonly label: string;
  readonly onPress: () => void;
}

/** A titled column of footer links. */
export interface FooterGroup {
  /** Column heading, e.g. "Product". */
  readonly title: string;
  /** Links within the column. */
  readonly links: readonly FooterLink[];
}

export interface WebFooterProps {
  /** Link groups rendered as columns. */
  readonly groups: readonly FooterGroup[];
  /** Copyright / legal line rendered below the columns. */
  readonly copyright?: string;
  /** Style spread onto the root footer. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  columns: { flexDirection: 'row', flexWrap: 'wrap' },
  linkHit: { minHeight: 40, justifyContent: 'center' },
});

interface FooterColumnProps {
  readonly group: FooterGroup;
  readonly cellStyle: ViewStyle;
}

const FooterColumnImpl = React.forwardRef<View, FooterColumnProps>(
  function FooterColumn(props, ref) {
    const { group, cellStyle } = props;
    return (
      <View ref={ref} accessibilityRole="none" style={cellStyle}>
        <VStack gap="xs">
          <Heading level={6} tone="secondary">
            {group.title}
          </Heading>
          {group.links.map((link) => (
            <FooterLinkButton key={link.label} link={link} />
          ))}
        </VStack>
      </View>
    );
  },
);
FooterColumnImpl.displayName = 'WebFooterColumn';
const FooterColumn = React.memo(FooterColumnImpl);

const FooterLinkButtonImpl = React.forwardRef<View, { readonly link: FooterLink }>(
  function FooterLinkButton(props, ref) {
    const { link } = props;
    return (
      <Pressable
        ref={ref}
        onPress={link.onPress}
        accessibilityRole="link"
        accessibilityLabel={link.label}
        style={staticStyles.linkHit}
      >
        <Caption tone="muted">{link.label}</Caption>
      </Pressable>
    );
  },
);
FooterLinkButtonImpl.displayName = 'WebFooterLink';
const FooterLinkButton = React.memo(FooterLinkButtonImpl);

const WebFooterImpl = React.forwardRef<View, WebFooterProps>(function WebFooter(props, ref) {
  const { groups, copyright, style } = props;
  const tokens = useTokens();
  const columns = useResponsive({ xs: 2, md: 4 }) ?? 2;

  const wrapStyle = React.useMemo<ViewStyle>(
    () => ({
      width: '100%',
      padding: tokens.space.lg,
      backgroundColor: tokens.colors.background.subtle,
      borderTopWidth: 1,
      borderTopColor: tokens.colors.border.default,
      gap: tokens.space.lg,
    }),
    [tokens],
  );

  const cellStyle = React.useMemo<ViewStyle>(
    () => ({
      width: `${100 / columns}%`,
      paddingRight: tokens.space.lg,
      marginBottom: tokens.space.md,
    }),
    [columns, tokens],
  );

  return (
    <View ref={ref} accessibilityRole="none" style={[wrapStyle, style]}>
      <View accessibilityRole="none" style={staticStyles.columns}>
        {groups.map((group) => (
          <FooterColumn key={group.title} group={group} cellStyle={cellStyle} />
        ))}
      </View>
      {copyright ? <Caption tone="muted">{copyright}</Caption> : null}
    </View>
  );
});

WebFooterImpl.displayName = 'WebFooter';

export const WebFooter = React.memo(WebFooterImpl);
