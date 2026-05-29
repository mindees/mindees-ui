import { Checkbox, Label, Text, useTokens } from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { type Role } from './RoleSelector';

/** A permission that can be granted per-role. */
export interface Permission {
  /** Stable machine key, e.g. "billing.read". */
  readonly key: string;
  /** Human label, e.g. "View billing". */
  readonly label: string;
}

/** Lookup of granted state, keyed first by role key then by permission key. */
export type PermissionMatrixValue = Readonly<Record<string, Readonly<Record<string, boolean>>>>;

export interface PermissionMatrixProps {
  /** Roles forming the matrix columns. */
  readonly roles: readonly Role[];
  /** Permissions forming the matrix rows. */
  readonly permissions: readonly Permission[];
  /** Granted state lookup: `value[roleKey][permKey]`. */
  readonly value: PermissionMatrixValue;
  /** Fired when a cell is toggled. */
  readonly onToggle: (roleKey: string, permKey: string) => void;
  /** Disable every cell. */
  readonly disabled?: boolean;
  /** Width of each role column in px. Defaults to 96. */
  readonly columnWidth?: number;
  /** Width of the leading permission-label column in px. Defaults to 160. */
  readonly labelWidth?: number;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  cell: { alignItems: 'center', justifyContent: 'center' },
  labelCell: { justifyContent: 'center' },
  checkbox: { alignSelf: 'center' },
});

const DEFAULT_COLUMN_WIDTH = 96;
const DEFAULT_LABEL_WIDTH = 160;
const ROW_MIN_HEIGHT = 44;

const PermissionMatrixImpl = React.forwardRef<ScrollView, PermissionMatrixProps>(
  function PermissionMatrix(props, ref) {
    const {
      roles,
      permissions,
      value,
      onToggle,
      disabled = false,
      columnWidth = DEFAULT_COLUMN_WIDTH,
      labelWidth = DEFAULT_LABEL_WIDTH,
      style,
    } = props;
    const tokens = useTokens();

    const headerRowStyle = React.useMemo<ViewStyle>(
      () => ({
        ...staticStyles.row,
        minHeight: ROW_MIN_HEIGHT,
        backgroundColor: tokens.colors.background.subtle,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.border.default,
      }),
      [tokens],
    );

    const bodyRowStyle = React.useMemo<ViewStyle>(
      () => ({
        ...staticStyles.row,
        minHeight: ROW_MIN_HEIGHT,
        borderBottomWidth: 1,
        borderBottomColor: tokens.colors.border.subtle,
      }),
      [tokens],
    );

    const cellPad = React.useMemo<ViewStyle>(
      () => ({ paddingHorizontal: tokens.space.sm, paddingVertical: tokens.space.xs }),
      [tokens],
    );

    return (
      <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator style={style}>
        <View accessibilityRole="none">
          <View accessibilityRole="none" style={headerRowStyle}>
            <View style={[staticStyles.labelCell, cellPad, { width: labelWidth }]}>
              <Label weight="semibold" tone="secondary">
                Permission
              </Label>
            </View>
            {roles.map((role) => (
              <View
                key={role.key}
                accessibilityRole="header"
                style={[staticStyles.cell, cellPad, { width: columnWidth }]}
              >
                <Label weight="semibold" tone="secondary" numberOfLines={1}>
                  {role.label}
                </Label>
              </View>
            ))}
          </View>

          {permissions.map((perm) => (
            <View key={perm.key} accessibilityRole="none" style={bodyRowStyle}>
              <View style={[staticStyles.labelCell, cellPad, { width: labelWidth }]}>
                <Text tone="primary" numberOfLines={2}>
                  {perm.label}
                </Text>
              </View>
              {roles.map((role) => (
                <PermissionCell
                  key={role.key}
                  roleKey={role.key}
                  roleLabel={role.label}
                  permKey={perm.key}
                  permLabel={perm.label}
                  checked={value[role.key]?.[perm.key] ?? false}
                  disabled={disabled}
                  onToggle={onToggle}
                  width={columnWidth}
                  cellPad={cellPad}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    );
  },
);

interface PermissionCellProps {
  readonly roleKey: string;
  readonly roleLabel: string;
  readonly permKey: string;
  readonly permLabel: string;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly onToggle: (roleKey: string, permKey: string) => void;
  readonly width: number;
  readonly cellPad: ViewStyle;
}

const PermissionCellImpl = React.forwardRef<View, PermissionCellProps>(
  function PermissionCell(props, ref) {
    const { roleKey, roleLabel, permKey, permLabel, checked, disabled, onToggle, width, cellPad } =
      props;
    const handleChange = React.useCallback(
      () => onToggle(roleKey, permKey),
      [onToggle, roleKey, permKey],
    );
    return (
      <View ref={ref} style={[staticStyles.cell, cellPad, { width }]}>
        <Checkbox
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          accessibilityLabel={`${permLabel} for ${roleLabel}`}
          style={staticStyles.checkbox}
        />
      </View>
    );
  },
);

PermissionCellImpl.displayName = 'PermissionMatrixCell';
const PermissionCell = React.memo(PermissionCellImpl);

PermissionMatrixImpl.displayName = 'PermissionMatrix';

export const PermissionMatrix = React.memo(PermissionMatrixImpl);
