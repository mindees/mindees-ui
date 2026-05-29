import { Button, HStack, Text, useTokens, VStack } from '@mindees/ui';
import * as React from 'react';
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from 'react-native';

/** A navigation link. */
export interface NavLink {
  /** Link label. */
  readonly label: string;
  /** Fired when the link is pressed. */
  readonly onPress: () => void;
}

/** A call-to-action shown at the end of the navbar. */
export interface NavCta {
  readonly label: string;
  readonly onPress: () => void;
}

export interface ResponsiveNavbarProps {
  /** Navigation links. */
  readonly links: readonly NavLink[];
  /** Logo slot rendered at the start. */
  readonly logo?: React.ReactNode;
  /** Optional trailing call-to-action. */
  readonly cta?: NavCta;
  /**
   * Width (px) at or below which the navbar collapses to a menu button.
   * Defaults to 768.
   */
  readonly collapseBelow?: number;
  /** Style spread onto the root navbar. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  links: { flexShrink: 1, flexWrap: 'wrap' },
  menuButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  menuGlyph: { width: 20, gap: 4 },
  menuBar: { height: 2, borderRadius: 1 },
  linkHit: { minHeight: 44, justifyContent: 'center' },
});

const MenuGlyphImpl = React.forwardRef<View, { readonly color: string }>(
  function MenuGlyph(props, ref) {
    const { color } = props;
    const barStyle = React.useMemo<ViewStyle>(
      () => ({ ...staticStyles.menuBar, backgroundColor: color }),
      [color],
    );
    return (
      <View ref={ref} accessibilityRole="none" style={staticStyles.menuGlyph}>
        <View style={barStyle} />
        <View style={barStyle} />
        <View style={barStyle} />
      </View>
    );
  },
);
MenuGlyphImpl.displayName = 'ResponsiveNavbarMenuGlyph';
const MenuGlyph = React.memo(MenuGlyphImpl);

const DEFAULT_COLLAPSE_BELOW = 768;

interface NavLinkButtonProps {
  readonly link: NavLink;
}

const NavLinkButtonImpl = React.forwardRef<View, NavLinkButtonProps>(
  function NavLinkButton(props, ref) {
    const { link } = props;
    return (
      <Pressable
        ref={ref}
        onPress={link.onPress}
        accessibilityRole="link"
        accessibilityLabel={link.label}
        style={staticStyles.linkHit}
      >
        <Text weight="medium" tone="secondary">
          {link.label}
        </Text>
      </Pressable>
    );
  },
);
NavLinkButtonImpl.displayName = 'ResponsiveNavbarLink';
const NavLinkButton = React.memo(NavLinkButtonImpl);

const ResponsiveNavbarImpl = React.forwardRef<View, ResponsiveNavbarProps>(
  function ResponsiveNavbar(props, ref) {
    const { links, logo, cta, collapseBelow = DEFAULT_COLLAPSE_BELOW, style } = props;
    const tokens = useTokens();
    const { width } = useWindowDimensions();
    const collapsed = width <= collapseBelow;
    const [open, setOpen] = React.useState(false);

    const toggleMenu = React.useCallback(() => setOpen((prev) => !prev), []);

    const wrapStyle = React.useMemo<ViewStyle>(
      () => ({
        width: '100%',
        paddingHorizontal: tokens.space.md,
        paddingVertical: tokens.space.sm,
        backgroundColor: tokens.colors.background.surface,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.border.default,
      }),
      [tokens],
    );

    return (
      <View ref={ref} accessibilityRole="none" style={[wrapStyle, style]}>
        <View accessibilityRole="none" style={staticStyles.bar}>
          <View accessibilityRole="none">{logo}</View>

          {collapsed ? (
            <Pressable
              onPress={toggleMenu}
              accessibilityRole="button"
              accessibilityLabel="Toggle navigation menu"
              accessibilityState={{ expanded: open }}
              style={staticStyles.menuButton}
            >
              <MenuGlyph color={tokens.colors.text.primary} />
            </Pressable>
          ) : (
            <HStack gap="md" align="center" style={staticStyles.links}>
              {links.map((link) => (
                <NavLinkButton key={link.label} link={link} />
              ))}
              {cta ? (
                <Button size="sm" variant="solid" tone="primary" onPress={cta.onPress}>
                  {cta.label}
                </Button>
              ) : null}
            </HStack>
          )}
        </View>

        {collapsed && open ? (
          <VStack gap="2xs" style={MENU_STYLE}>
            {links.map((link) => (
              <NavLinkButton key={link.label} link={link} />
            ))}
            {cta ? (
              <Button size="sm" variant="solid" tone="primary" fullWidth onPress={cta.onPress}>
                {cta.label}
              </Button>
            ) : null}
          </VStack>
        ) : null}
      </View>
    );
  },
);

const MENU_STYLE: ViewStyle = { marginTop: 8 };

ResponsiveNavbarImpl.displayName = 'ResponsiveNavbar';

export const ResponsiveNavbar = React.memo(ResponsiveNavbarImpl);
