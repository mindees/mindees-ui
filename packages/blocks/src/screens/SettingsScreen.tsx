import { space } from '@mindees/tokens';
import {
  BackButton,
  Box,
  ScreenWrapper,
  SettingsMenu,
  type SettingsMenuGroup,
  TopBar,
} from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

export interface SettingsScreenProps {
  /** Grouped settings rows rendered by the SettingsMenu primitive. */
  readonly groups: readonly SettingsMenuGroup[];
  /** Header title. Defaults to "Settings". */
  readonly title?: string;
  /** Called when the back button is pressed. The button is omitted when absent. */
  readonly onBack?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, paddingVertical: space.md },
});

const SettingsScreenImpl = React.forwardRef<View, SettingsScreenProps>(
  function SettingsScreen(props, ref) {
    const { groups, title = 'Settings', onBack, style } = props;

    const leading = onBack ? <BackButton onPress={onBack} /> : undefined;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          <TopBar title={title} leading={leading} />
          <ScrollView contentContainerStyle={staticStyles.content}>
            <SettingsMenu groups={groups} />
          </ScrollView>
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

SettingsScreenImpl.displayName = 'SettingsScreen';

/** Settings screen: titled header + grouped SettingsMenu rows. */
export const SettingsScreen = React.memo(SettingsScreenImpl);
