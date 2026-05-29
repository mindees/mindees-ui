import { space } from '@mindees/tokens';
import { Box, ScreenWrapper, VStack } from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { ProfileCard, type ProfileStat, type ProfileUser } from '../account';

export interface ProfileScreenProps {
  /** User identity rendered in the ProfileCard. */
  readonly user: ProfileUser;
  /** Optional stat row (followers, following, posts…). */
  readonly stats?: readonly ProfileStat[];
  /** Shows an "Edit profile" button on the card when provided. */
  readonly onEdit?: () => void;
  /** Sticky header rendered above the scrollable content (e.g. a TopBar). */
  readonly header?: React.ReactNode;
  /** Tabs/sections rendered below the profile card. */
  readonly children?: React.ReactNode;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, padding: space.md },
});

const ProfileScreenImpl = React.forwardRef<View, ProfileScreenProps>(
  function ProfileScreen(props, ref) {
    const { user, stats, onEdit, header, children, style } = props;

    return (
      <Box ref={ref} style={[staticStyles.root, style]}>
        <ScreenWrapper edges={EDGES}>
          {header}
          <ScrollView contentContainerStyle={staticStyles.content}>
            <VStack gap="lg">
              <ProfileCard user={user} stats={stats} onEdit={onEdit} />
              {children}
            </VStack>
          </ScrollView>
        </ScreenWrapper>
      </Box>
    );
  },
);

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

ProfileScreenImpl.displayName = 'ProfileScreen';

/** Profile screen: ProfileCard header + content tabs/sections. */
export const ProfileScreen = React.memo(ProfileScreenImpl);
