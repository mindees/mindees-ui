import { Caption, List, ListItem, Text } from '@mindees/ui';
import * as React from 'react';
import {
  FlatList,
  type ListRenderItemInfo,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

/** A single audit event row. */
export interface AuditEvent {
  /** Stable identity for list rendering. */
  readonly id: string;
  /** Who performed the action, e.g. "jane@acme.com". */
  readonly actor: string;
  /** What happened, e.g. "Updated billing plan". */
  readonly action: string;
  /** What the action targeted, e.g. "Workspace settings". */
  readonly target?: string;
  /** Pre-formatted timestamp, e.g. "2026-05-29 14:02". */
  readonly time: string;
}

export interface AuditLogProps {
  /** Audit events, newest-first by convention (not sorted here). */
  readonly events: readonly AuditEvent[];
  /** Rendered when `events` is empty. */
  readonly ListEmptyComponent?: React.ComponentProps<typeof FlatList>['ListEmptyComponent'];
  /** Header slot rendered above the list. */
  readonly ListHeaderComponent?: React.ComponentProps<typeof FlatList>['ListHeaderComponent'];
  /** Disable internal scrolling (e.g. when nested in a ScrollView). */
  readonly scrollEnabled?: boolean;
  /** Style spread onto the list container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  time: { flexShrink: 0 },
});

const ACTOR_STYLE: TextStyle = { fontVariant: ['tabular-nums'] };

function keyExtractor(item: AuditEvent): string {
  return item.id;
}

const AuditRowImpl = React.forwardRef<View, { readonly event: AuditEvent }>(
  function AuditRow(props, ref) {
    const { event } = props;
    const title = (
      <Text weight="medium" tone="primary" numberOfLines={2}>
        {event.action}
        {event.target ? <Text tone="secondary">{` — ${event.target}`}</Text> : null}
      </Text>
    );
    const description = (
      <Caption tone="muted" numberOfLines={1} style={ACTOR_STYLE}>
        {event.actor}
      </Caption>
    );
    const trailing = (
      <Caption tone="muted" style={staticStyles.time}>
        {event.time}
      </Caption>
    );
    return <ListItem ref={ref} title={title} description={description} trailing={trailing} />;
  },
);
AuditRowImpl.displayName = 'AuditLogRow';
const AuditRow = React.memo(AuditRowImpl);

const AuditLogImpl = React.forwardRef<FlatList<AuditEvent>, AuditLogProps>(
  function AuditLog(props, ref) {
    const { events, ListEmptyComponent, ListHeaderComponent, scrollEnabled = true, style } = props;

    const renderItem = React.useCallback(
      ({ item }: ListRenderItemInfo<AuditEvent>) => <AuditRow event={item} />,
      [],
    );

    return (
      <List style={style}>
        <FlatList
          ref={ref}
          data={events}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
        />
      </List>
    );
  },
);

AuditLogImpl.displayName = 'AuditLog';

export const AuditLog = React.memo(AuditLogImpl);
