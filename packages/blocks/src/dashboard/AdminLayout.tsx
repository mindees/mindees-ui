import { Box, Heading, useResponsive, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface AdminLayoutProps {
  /** Optional title rendered in the header bar (when no custom `header`). */
  readonly title?: string;
  /** Sidebar navigation slot. Hidden on narrow viewports. */
  readonly nav?: React.ReactNode;
  /** Custom header slot. Overrides the default title bar when provided. */
  readonly header?: React.ReactNode;
  /** Main content. */
  readonly children?: React.ReactNode;
  /** Width of the sidebar in px on wide viewports. Defaults to 260. */
  readonly sidebarWidth?: number;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  body: { flex: 1, flexDirection: 'row' },
  content: { flex: 1, minWidth: 0 },
});

const DEFAULT_SIDEBAR_WIDTH = 260;

const AdminLayoutImpl = React.forwardRef<View, AdminLayoutProps>(function AdminLayout(props, ref) {
  const { title, nav, header, children, sidebarWidth = DEFAULT_SIDEBAR_WIDTH, style } = props;
  const tokens = useTokens();
  // Sidebar only shows alongside content from `md` upward; narrow viewports
  // get content-only (host app surfaces nav via its own drawer/menu).
  const showSidebar = (useResponsive({ xs: false, md: true }) ?? false) && nav != null;

  const headerStyle = React.useMemo<ViewStyle>(
    () => ({
      paddingHorizontal: tokens.space.md,
      paddingVertical: tokens.space.sm,
      borderBottomWidth: 1,
      borderBottomColor: tokens.colors.border.default,
      backgroundColor: tokens.colors.background.surface,
    }),
    [tokens],
  );

  const sidebarStyle = React.useMemo<ViewStyle>(
    () => ({
      width: sidebarWidth,
      borderRightWidth: 1,
      borderRightColor: tokens.colors.border.default,
      backgroundColor: tokens.colors.background.subtle,
      padding: tokens.space.md,
    }),
    [tokens, sidebarWidth],
  );

  const contentStyle = React.useMemo<ViewStyle>(
    () => ({ ...staticStyles.content, padding: tokens.space.md }),
    [tokens],
  );

  return (
    <View ref={ref} accessibilityRole="none" style={[staticStyles.root, style]}>
      {header ? (
        <View accessibilityRole="header" style={headerStyle}>
          {header}
        </View>
      ) : title ? (
        <View accessibilityRole="header" style={headerStyle}>
          <Heading level={4} numberOfLines={1}>
            {title}
          </Heading>
        </View>
      ) : null}

      <View accessibilityRole="none" style={staticStyles.body}>
        {showSidebar ? (
          <Box accessibilityRole="none" style={sidebarStyle}>
            {nav}
          </Box>
        ) : null}
        <View accessibilityRole="none" style={contentStyle}>
          {children}
        </View>
      </View>
    </View>
  );
});

AdminLayoutImpl.displayName = 'AdminLayout';

export const AdminLayout = React.memo(AdminLayoutImpl);
