import { Badge, type BadgeTone, Card, Heading, List, ListItem, Text } from '@mindees/ui';
import * as React from 'react';
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  type View,
  type ViewStyle,
} from 'react-native';

/** Operational state of a monitored service. */
export type ServiceStatus = 'operational' | 'degraded' | 'down';

/** A single service row in the status panel. */
export interface ServiceStatusEntry {
  /** Stable identity for list rendering. */
  readonly id: string;
  /** Service name, e.g. "API". */
  readonly name: string;
  /** Current operational state. */
  readonly status: ServiceStatus;
  /** Optional detail, e.g. "Elevated latency". */
  readonly detail?: string;
}

export interface SystemStatusPanelProps {
  /** Services to render, in display order. */
  readonly services: readonly ServiceStatusEntry[];
  /** Optional panel title. */
  readonly title?: string;
  /** Style spread onto the root card. */
  readonly style?: StyleProp<ViewStyle>;
}

const STATUS_TONE: Record<ServiceStatus, BadgeTone> = {
  operational: 'success',
  degraded: 'warning',
  down: 'danger',
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
  operational: 'Operational',
  degraded: 'Degraded',
  down: 'Down',
};

const staticStyles = StyleSheet.create({
  card: { padding: 0, overflow: 'hidden' },
});

const StatusRowImpl = React.forwardRef<View, { readonly service: ServiceStatusEntry }>(
  function StatusRow(props, ref) {
    const { service } = props;
    const trailing = (
      <Badge tone={STATUS_TONE[service.status]} variant="subtle">
        {STATUS_LABEL[service.status]}
      </Badge>
    );
    const description = service.detail ? (
      <Text variant="caption" tone="muted" numberOfLines={1}>
        {service.detail}
      </Text>
    ) : undefined;
    return (
      <ListItem ref={ref} title={service.name} description={description} trailing={trailing} />
    );
  },
);
StatusRowImpl.displayName = 'SystemStatusRow';
const StatusRow = React.memo(StatusRowImpl);

const SystemStatusPanelImpl = React.forwardRef<View, SystemStatusPanelProps>(
  function SystemStatusPanel(props, ref) {
    const { services, title, style } = props;
    return (
      <Card ref={ref} variant="outlined" style={[staticStyles.card, style]}>
        {title ? (
          <Heading level={4} style={TITLE_STYLE}>
            {title}
          </Heading>
        ) : null}
        <List>
          {services.map((service) => (
            <StatusRow key={service.id} service={service} />
          ))}
        </List>
      </Card>
    );
  },
);

const TITLE_STYLE: TextStyle = { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 };

SystemStatusPanelImpl.displayName = 'SystemStatusPanel';

export const SystemStatusPanel = React.memo(SystemStatusPanelImpl);
