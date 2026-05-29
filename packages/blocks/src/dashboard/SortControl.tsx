import { ChevronDownIcon, ChevronUpIcon } from '@mindees/icons';
import { Button, HStack, Select, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

/** Sort direction. */
export type SortDirection = 'asc' | 'desc';

/** A sortable field option. */
export interface SortOption {
  /** Stable machine key, e.g. "createdAt". */
  readonly key: string;
  /** Human label, e.g. "Date created". */
  readonly label: string;
}

/** Current sort state: which field and which direction. */
export interface SortValue {
  readonly key: string;
  readonly dir: SortDirection;
}

export interface SortControlProps {
  /** Fields available for sorting. */
  readonly options: readonly SortOption[];
  /** Current sort state. */
  readonly value: SortValue;
  /** Fired with the next sort state. */
  readonly onChange: (value: SortValue) => void;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const SortControlImpl = React.forwardRef<View, SortControlProps>(function SortControl(props, ref) {
  const { options, value, onChange, style } = props;
  const tokens = useTokens();

  const selectOptions = React.useMemo(
    () => options.map((option) => ({ label: option.label, value: option.key })),
    [options],
  );

  const handleKeyChange = React.useCallback(
    (key: string) => onChange({ key, dir: value.dir }),
    [onChange, value.dir],
  );

  const handleDirToggle = React.useCallback(
    () => onChange({ key: value.key, dir: value.dir === 'asc' ? 'desc' : 'asc' }),
    [onChange, value.key, value.dir],
  );

  const isAsc = value.dir === 'asc';
  const icon = isAsc ? (
    <ChevronUpIcon size={18} color={tokens.colors.text.primary} />
  ) : (
    <ChevronDownIcon size={18} color={tokens.colors.text.primary} />
  );

  return (
    <HStack ref={ref} gap="xs" align="center" style={style}>
      <Select
        options={selectOptions}
        value={value.key}
        onChange={handleKeyChange}
        placeholder="Sort by…"
        accessibilityLabel="Sort field"
        style={SELECT_STYLE}
      />
      <Button
        variant="outline"
        tone="neutral"
        onPress={handleDirToggle}
        leading={icon}
        accessibilityLabel={isAsc ? 'Sort ascending' : 'Sort descending'}
      >
        {isAsc ? 'Asc' : 'Desc'}
      </Button>
    </HStack>
  );
});

const SELECT_STYLE: ViewStyle = { flex: 1, minWidth: 140 };

SortControlImpl.displayName = 'SortControl';

export const SortControl = React.memo(SortControlImpl);
