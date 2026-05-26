import * as React from 'react';
import { Pressable, ScrollView, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

interface TabsContextValue {
  readonly value: string;
  readonly setValue: (next: string) => void;
}
const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (next: string) => void;
  readonly children?: React.ReactNode;
}

const TabsImpl = React.forwardRef<View, TabsProps>(function Tabs(props, _ref) {
  const { value, defaultValue, onValueChange, children } = props;
  const [internal, setInternal] = React.useState(defaultValue ?? '');
  const resolved = value ?? internal;
  const setValue = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternal(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );
  const ctx = React.useMemo(() => ({ value: resolved, setValue }), [resolved, setValue]);
  return <TabsContext.Provider value={ctx}>{children}</TabsContext.Provider>;
});

TabsImpl.displayName = 'Tabs';

export const Tabs = tagComponent(TabsImpl, 'Tabs');

// ---- TabList -----------------------------------------------------------
export interface TabListProps {
  readonly scrollable?: boolean;
  readonly children?: React.ReactNode;
}

export function TabList({ scrollable = false, children }: TabListProps): React.ReactElement {
  const tokens = useTokens();
  const listStyle: ViewStyle = {
    flexDirection: 'row',
    gap: tokens.space.xs,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.subtle,
    paddingHorizontal: tokens.space.sm,
  };
  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={listStyle}
      >
        {children}
      </ScrollView>
    );
  }
  return (
    <Pressable accessibilityRole="tablist" style={listStyle}>
      {children}
    </Pressable>
  );
}

// ---- Tab ---------------------------------------------------------------
export interface TabProps {
  readonly value: string;
  readonly children: React.ReactNode;
  readonly disabled?: boolean;
}

export function Tab({ value, children, disabled = false }: TabProps): React.ReactElement {
  const ctx = React.useContext(TabsContext);
  const tokens = useTokens();
  const active = ctx?.value === value;
  const style: ViewStyle = {
    paddingHorizontal: tokens.space.md,
    paddingVertical: tokens.space.sm,
    borderBottomWidth: 2,
    borderBottomColor: active ? tokens.colors.action.primary : 'transparent',
    opacity: disabled ? 0.5 : 1,
  };
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active, disabled }}
      onPress={() => !disabled && ctx?.setValue(value)}
      disabled={disabled}
      style={style}
    >
      <Text tone={active ? 'link' : 'secondary'} weight={active ? 'semibold' : 'regular'}>
        {children}
      </Text>
    </Pressable>
  );
}

// ---- TabPanel ----------------------------------------------------------
export interface TabPanelProps {
  readonly value: string;
  readonly children?: React.ReactNode;
}

export function TabPanel({ value, children }: TabPanelProps): React.ReactElement | null {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return <>{children}</>;
}
