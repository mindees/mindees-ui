import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

interface CheckboxGroupContextValue {
  readonly value: readonly string[];
  readonly toggle: (key: string) => void;
  readonly disabled: boolean;
}

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextValue | undefined>(
  undefined,
);

export interface CheckboxGroupProps extends Omit<ViewProps, 'style'> {
  /** Controlled list of checked item keys. */
  readonly value?: readonly string[];
  readonly defaultValue?: readonly string[];
  readonly onValueChange?: (next: readonly string[]) => void;
  readonly disabled?: boolean;
  readonly children?: React.ReactNode;
  /** Style applied to the group container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
}

/**
 * Logical wrapper around multiple `Checkbox` children. Tracks selection by
 * stable string keys; children call `useCheckboxGroup()` to read state and
 * dispatch toggles. Defers to the wrapped Checkbox's own onChange when the
 * group isn't present, so a bare Checkbox still works.
 */
const CheckboxGroupImpl = React.forwardRef<View, CheckboxGroupProps>(
  function CheckboxGroup(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      children,
      style,
      ...rest
    } = props;
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<readonly string[]>(defaultValue ?? []);
    const resolved = isControlled ? value : internal;

    const toggle = React.useCallback(
      (key: string) => {
        const has = resolved.includes(key);
        const next = has ? resolved.filter((k) => k !== key) : [...resolved, key];
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
      [resolved, isControlled, onValueChange],
    );

    const ctx: CheckboxGroupContextValue = React.useMemo(
      () => ({ value: resolved, toggle, disabled }),
      [resolved, toggle, disabled],
    );

    return (
      <CheckboxGroupContext.Provider value={ctx}>
        <View ref={ref} accessibilityRole="none" style={style} {...rest}>
          {children}
        </View>
      </CheckboxGroupContext.Provider>
    );
  },
);

CheckboxGroupImpl.displayName = 'CheckboxGroup';

export const CheckboxGroup = tagComponent(CheckboxGroupImpl, 'CheckboxGroup');
