import { Caption, Select, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

/** A selectable role with an optional explanatory description. */
export interface Role {
  /** Stable machine key, e.g. "admin". */
  readonly key: string;
  /** Human label, e.g. "Administrator". */
  readonly label: string;
  /** Short description of what the role grants. */
  readonly description?: string;
}

export interface RoleSelectorProps {
  /** Roles available for selection. */
  readonly roles: readonly Role[];
  /** Currently selected role key. */
  readonly value?: string;
  /** Fired with the newly-selected role key. */
  readonly onChange?: (key: string) => void;
  /** Trigger placeholder when nothing is selected. */
  readonly placeholder?: string;
  /** Force a disabled state. */
  readonly disabled?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const RoleSelectorImpl = React.forwardRef<View, RoleSelectorProps>(
  function RoleSelector(props, ref) {
    const { roles, value, onChange, placeholder = 'Select a role…', disabled, style } = props;

    const options = React.useMemo(
      () => roles.map((role) => ({ label: role.label, value: role.key })),
      [roles],
    );

    const selected = React.useMemo(() => roles.find((role) => role.key === value), [roles, value]);

    return (
      <VStack ref={ref} gap="2xs" style={style}>
        <Select
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          accessibilityLabel="Role"
        />
        {selected?.description ? <Caption tone="muted">{selected.description}</Caption> : null}
      </VStack>
    );
  },
);

RoleSelectorImpl.displayName = 'RoleSelector';

export const RoleSelector = React.memo(RoleSelectorImpl);
