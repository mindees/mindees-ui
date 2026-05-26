import * as React from 'react';
import { Pressable, type TextInput } from 'react-native';

import { CloseIcon, SearchIcon } from '@mindees/icons';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Input, type InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'leading' | 'trailing'> {
  /** Hide the search icon on the leading edge. */
  readonly hideIcon?: boolean;
  /** Called when the clear button is pressed. Receives the input value to clear externally. */
  readonly onClear?: () => void;
}

const SearchInputImpl = React.forwardRef<TextInput, SearchInputProps>(
  function SearchInput(props, ref) {
    const { hideIcon = false, onClear, value, onChangeText, ...rest } = props;
    const tokens = useTokens();
    const hasValue = typeof value === 'string' && value.length > 0;

    const leading = hideIcon ? undefined : (
      <SearchIcon size={18} color={tokens.colors.text.muted} />
    );
    const trailing = hasValue ? (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Clear search"
        hitSlop={8}
        onPress={() => {
          onClear?.();
          onChangeText?.('');
        }}
      >
        <CloseIcon size={16} color={tokens.colors.text.muted} />
      </Pressable>
    ) : undefined;

    return (
      <Input
        ref={ref}
        leading={leading}
        trailing={trailing}
        value={value}
        onChangeText={onChangeText}
        placeholder={rest.placeholder ?? 'Search…'}
        keyboardType="default"
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityRole="search"
        {...rest}
      />
    );
  },
);

SearchInputImpl.displayName = 'SearchInput';

export const SearchInput = tagComponent(SearchInputImpl, 'SearchInput');
