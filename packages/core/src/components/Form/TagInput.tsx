import * as React from 'react';
import {
  type NativeSyntheticEvent,
  type StyleProp,
  type TextInputKeyPressEventData,
  type TextInputSubmitEditingEventData,
  View,
  type ViewProps,
  type ViewStyle,
} from 'react-native';

import { useFormFieldA11y } from '../../a11y/useFormFieldA11y';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Chip } from '../Display/Tag';

import { Input, type InputProps } from './Input';

export interface TagInputProps
  extends
    Omit<ViewProps, 'children'>,
    Pick<InputProps, 'placeholder' | 'size' | 'invalid' | 'disabled'> {
  /** Current tags. */
  readonly value?: readonly string[];
  /** Fired with the full next array of tags after add/remove. */
  readonly onChange?: (value: string[]) => void;
  /** Block duplicate tags (case-insensitive). Defaults to true. */
  readonly dedupe?: boolean;
  /** Cap on the number of tags. */
  readonly maxTags?: number;
  /** Style applied to the field container. Caller value wins. */
  readonly style?: StyleProp<ViewStyle>;
  /** Accessible label for the inner text field. */
  readonly inputAccessibilityLabel?: string;
}

const EMPTY: readonly string[] = [];

const TagInputImpl = React.forwardRef<View, TagInputProps>(function TagInput(props, ref) {
  const {
    value = EMPTY,
    onChange,
    dedupe = true,
    maxTags,
    placeholder = 'Add tag…',
    size = 'md',
    invalid: invalidProp,
    disabled: disabledProp,
    style,
    inputAccessibilityLabel,
    ...rest
  } = props;
  const tokens = useTokens();
  const ctx = useFormFieldA11y();
  const invalid = invalidProp ?? ctx?.invalid ?? false;
  const disabled = disabledProp ?? ctx?.disabled ?? false;
  const [draft, setDraft] = React.useState('');

  const commit = React.useCallback(() => {
    const trimmed = draft.trim();
    if (trimmed.length === 0) return;
    if (typeof maxTags === 'number' && value.length >= maxTags) return;
    const exists = dedupe && value.some((t) => t.toLowerCase() === trimmed.toLowerCase());
    if (!exists) onChange?.([...value, trimmed]);
    setDraft('');
  }, [draft, maxTags, value, dedupe, onChange]);

  const removeAt = React.useCallback(
    (index: number) => {
      onChange?.(value.filter((_, i) => i !== index));
    },
    [value, onChange],
  );

  const handleSubmit = React.useCallback(
    (_e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      commit();
    },
    [commit],
  );

  const handleKeyPress = React.useCallback(
    (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
      if (e.nativeEvent.key === 'Backspace' && draft.length === 0 && value.length > 0) {
        removeAt(value.length - 1);
      }
    },
    [draft, value, removeAt],
  );

  const containerStyle: ViewStyle = {
    gap: tokens.space.xs,
    opacity: disabled ? 0.6 : 1,
  };

  const chipsWrapStyle: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.space['2xs'],
  };

  return (
    <View ref={ref} style={[containerStyle, style]} {...rest}>
      {value.length > 0 ? (
        <View style={chipsWrapStyle}>
          {value.map((tag, index) => (
            <Chip
              key={`${tag}-${index}`}
              size="sm"
              onRemove={disabled ? undefined : () => removeAt(index)}
            >
              {tag}
            </Chip>
          ))}
        </View>
      ) : null}
      <Input
        size={size}
        invalid={invalid}
        disabled={disabled}
        value={draft}
        onChangeText={setDraft}
        onSubmitEditing={handleSubmit}
        onKeyPress={handleKeyPress}
        blurOnSubmit={false}
        returnKeyType="done"
        placeholder={placeholder}
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={inputAccessibilityLabel}
      />
    </View>
  );
});

TagInputImpl.displayName = 'TagInput';

export const TagInput = tagComponent(TagInputImpl, 'TagInput');
