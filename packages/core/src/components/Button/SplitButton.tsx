import { ChevronDownIcon } from '@mindees/icons';
import * as React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { DropdownMenu, type MenuItem } from '../Overlay/DropdownMenu';

import {
  Button,
  resolveButtonTextColor,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from './Button';
import { IconButton } from './IconButton';

export interface SplitButtonProps {
  /** Primary action label. */
  readonly children?: React.ReactNode;
  /** Primary action handler. */
  readonly onPress?: () => void;
  /** Secondary actions shown in the dropdown menu. */
  readonly items: readonly MenuItem[];
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly tone?: ButtonTone;
  readonly disabled?: boolean;
  /** Accessible label for the dropdown toggle. Defaults to "More actions". */
  readonly menuAccessibilityLabel?: string;
  readonly placement?: 'top' | 'bottom';
  /** Style applied to the row container. */
  readonly style?: StyleProp<ViewStyle>;
}

const CHEVRON_SIZE: Record<ButtonSize, number> = { sm: 14, md: 16, lg: 18 };
const TOGGLE_SIZE: Record<ButtonSize, 'sm' | 'md' | 'lg'> = { sm: 'sm', md: 'md', lg: 'lg' };

const SplitButtonImpl = React.forwardRef<View, SplitButtonProps>(function SplitButton(props, ref) {
  const {
    children,
    onPress,
    items,
    variant = 'solid',
    size = 'md',
    tone = 'primary',
    disabled = false,
    menuAccessibilityLabel = 'More actions',
    placement = 'bottom',
    style,
  } = props;
  const tokens = useTokens();
  const chevronColor = resolveButtonTextColor(tokens, variant, tone);

  const trigger = (
    <IconButton
      accessibilityLabel={menuAccessibilityLabel}
      size={TOGGLE_SIZE[size]}
      variant={variant === 'link' ? 'ghost' : variant}
      tone={tone === 'primary' ? 'primary' : 'neutral'}
      disabled={disabled}
      style={TOGGLE_STYLE}
    >
      <ChevronDownIcon size={CHEVRON_SIZE[size]} color={chevronColor} />
    </IconButton>
  );

  return (
    <View ref={ref} accessibilityRole="none" style={[ROW_STYLE, style]}>
      <Button
        variant={variant}
        size={size}
        tone={tone}
        disabled={disabled}
        onPress={onPress}
        style={PRIMARY_STYLE}
      >
        {children}
      </Button>
      <DropdownMenu trigger={trigger} items={items} placement={placement} />
    </View>
  );
});

// Hoisted: caller-independent style fragments. The primary button squares its
// trailing corners and the toggle squares its leading corners so the two read
// as a single joined control.
const ROW_STYLE: ViewStyle = {
  flexDirection: 'row',
  alignSelf: 'flex-start',
  alignItems: 'center',
};
const PRIMARY_STYLE: ViewStyle = {
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};
const TOGGLE_STYLE: ViewStyle = {
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
  borderRadius: 0,
};

SplitButtonImpl.displayName = 'SplitButton';

export const SplitButton = tagComponent(React.memo(SplitButtonImpl), 'SplitButton');
