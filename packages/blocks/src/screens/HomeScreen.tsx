import { space } from '@mindees/tokens';
import { Box, ScreenWrapper } from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface HomeScreenProps {
  /** Sticky header rendered above the scrollable content (e.g. a TopBar). */
  readonly header?: React.ReactNode;
  /** Scrollable page content — hero, sections, lists. */
  readonly children?: React.ReactNode;
  /** Outer padding applied to the scrollable content area. Defaults to "md". */
  readonly contentPadding?: 'none' | 'sm' | 'md' | 'lg';
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
});

const PAD = { none: 0, sm: space.sm, md: space.md, lg: space.lg } as const;

const HomeScreenImpl = React.forwardRef<View, HomeScreenProps>(function HomeScreen(props, ref) {
  const { header, children, contentPadding = 'md', style } = props;

  const contentStyle = React.useMemo<ViewStyle>(
    () => ({ flexGrow: 1, padding: PAD[contentPadding] }),
    [contentPadding],
  );

  return (
    <Box ref={ref} style={[staticStyles.root, style]}>
      <ScreenWrapper edges={EDGES}>
        {header}
        <ScrollView contentContainerStyle={contentStyle}>{children}</ScrollView>
      </ScreenWrapper>
    </Box>
  );
});

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

HomeScreenImpl.displayName = 'HomeScreen';

/** App home: optional sticky header + scrollable hero/section content. */
export const HomeScreen = React.memo(HomeScreenImpl);
