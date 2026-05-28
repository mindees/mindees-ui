import { Avatar, Button, Caption, Card, Heading, HStack, Stat, Text, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

/** A single labelled statistic shown in the ProfileCard stat row. */
export interface ProfileStat {
  /** Stable identity for list rendering. */
  readonly id: string;
  /** Short label, e.g. "Followers". */
  readonly label: string;
  /** Pre-formatted value, e.g. "1.2k". */
  readonly value: string;
}

/** The user identity rendered by ProfileCard. */
export interface ProfileUser {
  readonly name: string;
  /** Optional @handle shown under the name. */
  readonly handle?: string;
  /** Short bio / tagline. */
  readonly bio?: string;
  /** Avatar image URL. Falls back to initials when absent. */
  readonly avatar?: string;
}

export interface ProfileCardProps {
  /** Identity to render. */
  readonly user: ProfileUser;
  /** Optional row of stats (followers, following, posts…). */
  readonly stats?: readonly ProfileStat[];
  /** Shows an "Edit profile" button when provided. */
  readonly onEdit?: () => void;
  /** Label for the edit button. Defaults to "Edit profile". */
  readonly editLabel?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  statRow: { flexWrap: 'wrap' },
  edit: { alignSelf: 'flex-start' },
});

const ProfileCardImpl = React.forwardRef<View, ProfileCardProps>(function ProfileCard(props, ref) {
  const { user, stats, onEdit, editLabel = 'Edit profile', style } = props;

  return (
    <Card ref={ref} style={style}>
      <VStack gap="md">
        <HStack gap="md" align="center">
          <Avatar src={user.avatar} name={user.name} size="lg" />
          <VStack gap="3xs" style={NAME_BLOCK}>
            <Heading level={4} numberOfLines={1}>
              {user.name}
            </Heading>
            {user.handle ? (
              <Caption tone="muted" numberOfLines={1}>
                {user.handle}
              </Caption>
            ) : null}
          </VStack>
        </HStack>

        {user.bio ? <Text tone="secondary">{user.bio}</Text> : null}

        {stats && stats.length > 0 ? (
          <HStack gap="lg" style={staticStyles.statRow}>
            {stats.map((stat) => (
              <Stat key={stat.id} label={stat.label} value={stat.value} />
            ))}
          </HStack>
        ) : null}

        {onEdit ? (
          <Button variant="outline" tone="neutral" onPress={onEdit} style={staticStyles.edit}>
            {editLabel}
          </Button>
        ) : null}
      </VStack>
    </Card>
  );
});

const NAME_BLOCK: ViewStyle = { flexShrink: 1 };

ProfileCardImpl.displayName = 'ProfileCard';

export const ProfileCard = React.memo(ProfileCardImpl);
