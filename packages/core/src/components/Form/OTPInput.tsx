import * as React from 'react';
import {
  Pressable,
  type StyleProp,
  TextInput,
  type TextStyle,
  View,
  type ViewStyle,
} from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface OTPInputProps {
  /** Number of code boxes. Defaults to 6. */
  readonly length?: number;
  /** Controlled value (the full code so far). */
  readonly value?: string;
  /** Called whenever the code changes. */
  readonly onChangeText?: (code: string) => void;
  /** Called once when the code reaches `length` characters. */
  readonly onComplete?: (code: string) => void;
  /** Mask each character (used by PINInput). */
  readonly secureTextEntry?: boolean;
  /** Disable input. */
  readonly disabled?: boolean;
  /** Auto-focus on mount. */
  readonly autoFocus?: boolean;
  /** Accessible label for the whole code field. */
  readonly accessibilityLabel?: string;
  /** Style applied to the boxes row container. */
  readonly style?: StyleProp<ViewStyle>;
}

const DEFAULT_LENGTH = 6;
const DOT = '•';

// Visually hidden but kept in the a11y/focus tree as the single input target.
const HIDDEN_INPUT_STYLE: TextStyle = { position: 'absolute', width: 1, height: 1, opacity: 0 };

/** A single hidden TextInput drives the visible boxes — only one focus target,
 * so screen readers and keyboards stay simple and predictable. */
const OTPInputImpl = React.forwardRef<View, OTPInputProps>(function OTPInput(props, ref) {
  const {
    length = DEFAULT_LENGTH,
    value,
    onChangeText,
    onComplete,
    secureTextEntry = false,
    disabled = false,
    autoFocus = false,
    accessibilityLabel,
    style,
  } = props;
  const tokens = useTokens();
  const inputRef = React.useRef<TextInput>(null);
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState('');
  const code = isControlled ? value : internal;
  const [focused, setFocused] = React.useState(false);

  const handleChange = React.useCallback(
    (text: string) => {
      const next = text.replace(/\D/g, '').slice(0, length);
      if (!isControlled) setInternal(next);
      onChangeText?.(next);
      if (next.length === length) onComplete?.(next);
    },
    [isControlled, length, onChangeText, onComplete],
  );

  const focus = React.useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const rowStyle: ViewStyle = {
    flexDirection: 'row',
    gap: tokens.space.xs,
    opacity: disabled ? 0.6 : 1,
  };

  // The active box is the first empty slot (or the last box when full).
  const activeIndex = Math.min(code.length, length - 1);

  const boxes = [];
  for (let i = 0; i < length; i += 1) {
    const char = code[i] ?? '';
    const isActive = focused && i === activeIndex;
    const boxStyle: ViewStyle = {
      flex: 1,
      minWidth: 40,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: isActive ? 2 : 1,
      borderColor: isActive ? tokens.colors.border.focus : tokens.colors.border.default,
      borderRadius: tokens.radii.md,
      backgroundColor: tokens.colors.background.surface,
    };
    boxes.push(
      <View key={i} style={boxStyle}>
        <Text>{char === '' ? '' : secureTextEntry ? DOT : char}</Text>
      </View>,
    );
  }

  return (
    <Pressable
      ref={ref}
      onPress={disabled ? undefined : focus}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? (secureTextEntry ? 'PIN code' : 'One-time code')}
      style={[rowStyle, style]}
    >
      {boxes}
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        editable={!disabled}
        autoFocus={autoFocus}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        secureTextEntry={secureTextEntry}
        maxLength={length}
        style={HIDDEN_INPUT_STYLE}
        caretHidden
      />
    </Pressable>
  );
});

OTPInputImpl.displayName = 'OTPInput';

export const OTPInput = tagComponent(OTPInputImpl, 'OTPInput');
