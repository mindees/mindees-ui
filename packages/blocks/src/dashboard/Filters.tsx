import { Pill, Select, type SelectOption, useTokens } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

/** A filter option for select-style filters. */
export interface FilterOption {
  readonly label: string;
  readonly value: string;
}

/**
 * A single filter control. When `options` is provided it renders as a Select;
 * otherwise it renders as a toggle chip (boolean on/off).
 */
export interface FilterDef {
  /** Stable machine key, e.g. "status". */
  readonly key: string;
  /** Human label, e.g. "Status". */
  readonly label: string;
  /** When present, the filter is a single-select; otherwise a toggle. */
  readonly options?: readonly FilterOption[];
}

/**
 * Current filter state, keyed by filter key. Select filters hold the chosen
 * option value (string); toggle filters hold a boolean.
 */
export type FilterValue = Readonly<Record<string, string | boolean | undefined>>;

export interface FiltersProps {
  /** Filter definitions, in display order. */
  readonly filters: readonly FilterDef[];
  /** Current filter state. */
  readonly value: FilterValue;
  /** Fired when a filter changes. */
  readonly onChange: (key: string, value: string | boolean) => void;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
  select: { minWidth: 160 },
});

const FiltersImpl = React.forwardRef<View, FiltersProps>(function Filters(props, ref) {
  const { filters, value, onChange, style } = props;
  const tokens = useTokens();

  const rowStyle = React.useMemo<ViewStyle>(
    () => ({ ...staticStyles.row, gap: tokens.space.xs }),
    [tokens],
  );

  return (
    <View ref={ref} accessibilityRole="none" style={[rowStyle, style]}>
      {filters.map((filter) =>
        filter.options ? (
          <FilterSelect
            key={filter.key}
            filterKey={filter.key}
            options={filter.options}
            value={
              typeof value[filter.key] === 'string' ? (value[filter.key] as string) : undefined
            }
            placeholder={filter.label}
            onChange={onChange}
          />
        ) : (
          <FilterToggle
            key={filter.key}
            filterKey={filter.key}
            label={filter.label}
            active={value[filter.key] === true}
            onChange={onChange}
          />
        ),
      )}
    </View>
  );
});

interface FilterSelectProps {
  readonly filterKey: string;
  readonly options: readonly FilterOption[];
  readonly value?: string;
  readonly placeholder: string;
  readonly onChange: (key: string, value: string) => void;
}

const FilterSelectImpl = React.forwardRef<View, FilterSelectProps>(
  function FilterSelect(props, ref) {
    const { filterKey, options, value, placeholder, onChange } = props;
    const selectOptions = options as readonly SelectOption[];
    const handleChange = React.useCallback(
      (next: string) => onChange(filterKey, next),
      [onChange, filterKey],
    );
    return (
      <Select
        ref={ref}
        options={selectOptions}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        accessibilityLabel={placeholder}
        style={staticStyles.select}
      />
    );
  },
);
FilterSelectImpl.displayName = 'FilterSelect';
const FilterSelect = React.memo(FilterSelectImpl);

interface FilterToggleProps {
  readonly filterKey: string;
  readonly label: string;
  readonly active: boolean;
  readonly onChange: (key: string, value: boolean) => void;
}

const FilterToggleImpl = React.forwardRef<View, FilterToggleProps>(
  function FilterToggle(props, ref) {
    const { filterKey, label, active, onChange } = props;
    const handlePress = React.useCallback(
      () => onChange(filterKey, !active),
      [onChange, filterKey, active],
    );
    return (
      <Pill ref={ref} tone={active ? 'primary' : 'neutral'} onPress={handlePress}>
        {label}
      </Pill>
    );
  },
);
FilterToggleImpl.displayName = 'FilterToggle';
const FilterToggle = React.memo(FilterToggleImpl);

FiltersImpl.displayName = 'Filters';

export const Filters = React.memo(FiltersImpl);
