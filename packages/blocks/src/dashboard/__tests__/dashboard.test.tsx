import { ThemeProvider } from '@mindees/ui';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Text, View } from 'react-native';

import {
  AdminLayout,
  AnalyticsCards,
  AuditLog,
  type AuditEvent,
  type AnalyticsMetric,
  BulkActions,
  type BulkAction,
  Filters,
  type FilterDef,
  type FilterValue,
  type ManagedUser,
  PermissionMatrix,
  type Permission,
  type PermissionMatrixValue,
  type Role,
  RoleSelector,
  type ServiceStatusEntry,
  SortControl,
  type SortValue,
  SystemStatusPanel,
  UserManagementTable,
} from '../index';

const noop = (): void => undefined;

function renderWithTheme(ui: React.ReactElement): ReturnType<typeof render> {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const metrics: AnalyticsMetric[] = [
  { id: 'm1', label: 'Revenue', value: '$12.4k', delta: '+12%', trend: 'up' },
  { id: 'm2', label: 'Churn', value: '2.1%', delta: '-0.3%', trend: 'down' },
  { id: 'm3', label: 'Active users', value: '1,204' },
];

const events: AuditEvent[] = [
  {
    id: 'e1',
    actor: 'jane@acme.com',
    action: 'Updated billing plan',
    target: 'Workspace settings',
    time: '2026-05-29 14:02',
  },
  { id: 'e2', actor: 'sam@acme.com', action: 'Signed in', time: '2026-05-29 13:50' },
];

const roles: Role[] = [
  { key: 'admin', label: 'Admin', description: 'Full access to everything.' },
  { key: 'editor', label: 'Editor', description: 'Can edit content.' },
  { key: 'viewer', label: 'Viewer' },
];

const permissions: Permission[] = [
  { key: 'billing.read', label: 'View billing' },
  { key: 'billing.write', label: 'Manage billing' },
  { key: 'users.manage', label: 'Manage users' },
];

const matrixValue: PermissionMatrixValue = {
  admin: { 'billing.read': true, 'billing.write': true, 'users.manage': true },
  editor: { 'billing.read': true },
  viewer: {},
};

const services: ServiceStatusEntry[] = [
  { id: 's1', name: 'API', status: 'operational' },
  { id: 's2', name: 'Database', status: 'degraded', detail: 'Elevated latency' },
  { id: 's3', name: 'Email', status: 'down' },
];

const filters: FilterDef[] = [
  {
    key: 'status',
    label: 'Status',
    options: [
      { label: 'Active', value: 'active' },
      { label: 'Archived', value: 'archived' },
    ],
  },
  { key: 'starred', label: 'Starred only' },
];

const filterValue: FilterValue = { status: 'active', starred: true };

const sortOptions = [
  { key: 'createdAt', label: 'Date created' },
  { key: 'name', label: 'Name' },
];

const sortValue: SortValue = { key: 'createdAt', dir: 'desc' };

const bulkActions: BulkAction[] = [
  { key: 'archive', label: 'Archive', onPress: noop },
  { key: 'delete', label: 'Delete', destructive: true, onPress: noop },
];

const users: ManagedUser[] = [
  {
    id: 'u1',
    name: 'Jane Doe',
    email: 'jane@acme.com',
    role: 'Admin',
    status: 'active',
    avatar: 'https://example.com/jane.jpg',
  },
  { id: 'u2', name: 'Sam Kade', email: 'sam@acme.com', role: 'Editor', status: 'invited' },
  { id: 'u3', name: 'Lee Park', email: 'lee@acme.com', role: 'Viewer', status: 'suspended' },
];

describe('dashboard blocks — render without throwing', () => {
  it('renders AnalyticsCards (with and without explicit columns)', () => {
    expect(() => renderWithTheme(<AnalyticsCards metrics={metrics} />)).not.toThrow();
    expect(() =>
      renderWithTheme(<AnalyticsCards metrics={metrics} columns={2} onPressMetric={noop} />),
    ).not.toThrow();
  });

  it('renders AuditLog (with events and empty)', () => {
    expect(() => renderWithTheme(<AuditLog events={events} />)).not.toThrow();
    expect(() =>
      renderWithTheme(<AuditLog events={[]} ListEmptyComponent={<Text>None</Text>} />),
    ).not.toThrow();
  });

  it('renders RoleSelector (selected with description and unselected)', () => {
    expect(() =>
      renderWithTheme(<RoleSelector roles={roles} value="admin" onChange={noop} />),
    ).not.toThrow();
    expect(() => renderWithTheme(<RoleSelector roles={roles} onChange={noop} />)).not.toThrow();
  });

  it('renders PermissionMatrix', () => {
    expect(() =>
      renderWithTheme(
        <PermissionMatrix
          roles={roles}
          permissions={permissions}
          value={matrixValue}
          onToggle={noop}
        />,
      ),
    ).not.toThrow();
  });

  it('renders PermissionMatrix (disabled)', () => {
    expect(() =>
      renderWithTheme(
        <PermissionMatrix
          roles={roles}
          permissions={permissions}
          value={matrixValue}
          onToggle={noop}
          disabled
        />,
      ),
    ).not.toThrow();
  });

  it('renders SystemStatusPanel (with and without title)', () => {
    expect(() =>
      renderWithTheme(<SystemStatusPanel services={services} title="System status" />),
    ).not.toThrow();
    expect(() => renderWithTheme(<SystemStatusPanel services={services} />)).not.toThrow();
  });

  it('renders Filters', () => {
    expect(() =>
      renderWithTheme(<Filters filters={filters} value={filterValue} onChange={noop} />),
    ).not.toThrow();
  });

  it('renders SortControl', () => {
    expect(() =>
      renderWithTheme(<SortControl options={sortOptions} value={sortValue} onChange={noop} />),
    ).not.toThrow();
  });

  it('renders BulkActions (visible, with clear) and renders nothing when count is 0', () => {
    expect(() =>
      renderWithTheme(<BulkActions selectedCount={3} actions={bulkActions} onClear={noop} />),
    ).not.toThrow();
    const { toJSON } = renderWithTheme(<BulkActions selectedCount={0} actions={bulkActions} />);
    expect(toJSON()).toBeNull();
  });

  it('renders UserManagementTable (with actions and read-only)', () => {
    expect(() =>
      renderWithTheme(<UserManagementTable users={users} onEdit={noop} onRemove={noop} />),
    ).not.toThrow();
    expect(() => renderWithTheme(<UserManagementTable users={users} />)).not.toThrow();
  });

  it('renders AdminLayout (title + nav, custom header, content-only)', () => {
    expect(() =>
      renderWithTheme(
        <AdminLayout title="Admin" nav={<Text>Nav</Text>}>
          <Text>Content</Text>
        </AdminLayout>,
      ),
    ).not.toThrow();
    expect(() =>
      renderWithTheme(
        <AdminLayout header={<View />}>
          <Text>Content</Text>
        </AdminLayout>,
      ),
    ).not.toThrow();
    expect(() =>
      renderWithTheme(
        <AdminLayout>
          <Text>Content</Text>
        </AdminLayout>,
      ),
    ).not.toThrow();
  });
});
