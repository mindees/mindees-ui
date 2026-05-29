import { space } from '@mindees/tokens';
import { BackButton, Box, ScreenWrapper, TopBar, useTokens } from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface DetailsScreenProps {
  /** Title shown centered in the back header. */
  readonly title: string;
  /** Subtitle shown under the title. */
  readonly subtitle?: string;
  /** Called when the back button is pressed. The button is omitted when absent. */
  readonly onBack?: () => void;
  /** Trailing header slot (e.g. an action menu / icon button). */
  readonly headerTrailing?: React.ReactNode;
  /** Scrollable detail content. */
  readonly children?: React.ReactNode;
  /** Pinned footer action bar rendered below the content. */
  readonly footer?: React.ReactNode;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, padding: space.md },
});

const DetailsScreenImpl = React.forwardRef<View, DetailsScreenProps>(
  function DetailsScreen(props, ref) {
    const { title, subtitle, onBack, headerTrailing, children, footer, style } = props;
    const tokens = useTokens();

    const leading = onBack ? <BackButton onPress={onBack} /> : undefined;

    const footerStyle = React.useMemo<ViewStyle>(
      () => ({
        padding: tokens.space.md,
        backgroundColor: tokens.colors.background.elevated,
        borderTopWidth: 1,
        borderTopColor: tokens.colors.border.subtle,
      }),
      [tokens],
    );

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          <TopBar title={title} subtitle={subtitle} leading={leading} trailing={headerTrailing} />
          <ScrollView contentContainerStyle={staticStyles.content}>{children}</ScrollView>
          {footer ? <View style={footerStyle}>{footer}</View> : null}
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

DetailsScreenImpl.displayName = 'DetailsScreen';

/** Detail view: back header + scrollable content + optional footer action bar. */
export const DetailsScreen = React.memo(DetailsScreenImpl);
