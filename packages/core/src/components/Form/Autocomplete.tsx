import { resolveShadow } from '@mindees/tokens';
import * as React from 'react';
import {
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  type TextInput,
  View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

import { Input, type InputProps } from './Input';
import type { SelectOption } from './Select';

export interface AutocompleteProps extends Omit<InputProps, 'value' | 'onChange' | 'onChangeText'> {
  /** Options matched against the typed text. */
  readonly options: readonly SelectOption[];
  /** Current text in the field. */
  readonly value?: string;
  /** Fired on every keystroke with the raw text. */
  readonly onChange?: (text: string) => void;
  /** Fired when a suggestion is chosen. */
  readonly onSelect?: (option: SelectOption) => void;
  /** Override the default case-insensitive label-substring filter. */
  readonly filter?: (option: SelectOption, query: string) => boolean;
  /** Cap on the number of suggestions rendered. Defaults to 8. */
  readonly maxResults?: number;
  /** Style applied to the dropdown surface. */
  readonly listStyle?: StyleProp<ViewStyle>;
}

const ROW_MIN_HEIGHT = 44;
const DEFAULT_MAX_RESULTS = 8;

const staticStyles = StyleSheet.create({
  root: { position: 'relative' },
});

function defaultFilter(option: SelectOption, query: string): boolean {
  return option.label.toLowerCase().includes(query.toLowerCase());
}

const AutocompleteImpl = React.forwardRef<TextInput, AutocompleteProps>(
  function Autocomplete(props, ref) {
    const {
      options,
      value = '',
      onChange,
      onSelect,
      filter = defaultFilter,
      maxResults = DEFAULT_MAX_RESULTS,
      listStyle,
      onFocus,
      onBlur,
      ...rest
    } = props;
    const tokens = useTokens();
    const [focused, setFocused] = React.useState(false);

    const matches = React.useMemo(() => {
      if (value.length === 0) return [] as SelectOption[];
      const out: SelectOption[] = [];
      for (let i = 0; i < options.length && out.length < maxResults; i += 1) {
        const option = options[i];
        if (option && filter(option, value)) out.push(option);
      }
      return out;
    }, [options, value, filter, maxResults]);

    const open = focused && matches.length > 0;

    const handleChangeText = React.useCallback(
      (text: string) => {
        onChange?.(text);
      },
      [onChange],
    );

    const handleSelect = React.useCallback(
      (option: SelectOption) => {
        onChange?.(option.label);
        onSelect?.(option);
        setFocused(false);
      },
      [onChange, onSelect],
    );

    const handleFocus = React.useCallback(
      (e: Parameters<NonNullable<InputProps['onFocus']>>[0]) => {
        setFocused(true);
        onFocus?.(e);
      },
      [onFocus],
    );

    const handleBlur = React.useCallback(
      (e: Parameters<NonNullable<InputProps['onBlur']>>[0]) => {
        setFocused(false);
        onBlur?.(e);
      },
      [onBlur],
    );

    const listSurfaceStyle: ViewStyle = {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: tokens.space['2xs'],
      maxHeight: 240,
      backgroundColor: tokens.colors.background.elevated,
      borderColor: tokens.colors.border.default,
      borderWidth: 1,
      borderRadius: tokens.radii.md,
      overflow: 'hidden',
      zIndex: tokens.zIndex.dropdown,
      ...resolveShadow('lg'),
    };

    const rowBaseStyle: ViewStyle = {
      justifyContent: 'center',
      minHeight: ROW_MIN_HEIGHT,
      paddingHorizontal: tokens.space.sm,
      paddingVertical: tokens.space.xs,
    };

    return (
      <View style={staticStyles.root}>
        <Input
          ref={ref}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoCapitalize="none"
          autoCorrect={false}
          accessibilityRole="search"
          aria-expanded={open}
          {...rest}
        />
        {open ? (
          <View style={[listSurfaceStyle, listStyle]} accessibilityRole="menu">
            <ScrollView keyboardShouldPersistTaps="handled">
              {matches.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="menuitem"
                  onPress={() => handleSelect(option)}
                  style={({ pressed }) => [
                    rowBaseStyle,
                    pressed ? { backgroundColor: tokens.colors.background.subtle } : null,
                  ]}
                >
                  <Text tone="primary" numberOfLines={1}>
                    {option.label}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        ) : null}
      </View>
    );
  },
);

AutocompleteImpl.displayName = 'Autocomplete';

export const Autocomplete = tagComponent(AutocompleteImpl, 'Autocomplete');
