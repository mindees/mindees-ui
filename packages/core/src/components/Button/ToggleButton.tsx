import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Button, type ButtonBaseProps, type ButtonTone } from './Button';

export interface ToggleButtonProps extends Omit<ButtonBaseProps, 'onPress' | 'variant'> {
  /** Whether the button is currently selected / pressed-in. */
  readonly selected?: boolean;
  /** Called with the next selected state when toggled. */
  readonly onChange?: (selected: boolean) => void;
  /** Accent tone applied while selected. Defaults to "primary". */
  readonly tone?: ButtonTone;
}

const ToggleButtonImpl = React.forwardRef<View, ToggleButtonProps>(
  function ToggleButton(props, ref) {
    const { selected = false, onChange, tone = 'primary', disabled, children, ...rest } = props;

    const handlePress = React.useCallback(() => {
      if (onChange) onChange(!selected);
    }, [onChange, selected]);

    return (
      <Button
        ref={ref}
        variant={selected ? 'solid' : 'outline'}
        tone={selected ? tone : 'neutral'}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ selected, disabled: disabled ?? false }}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

ToggleButtonImpl.displayName = 'ToggleButton';

export const ToggleButton = tagComponent(React.memo(ToggleButtonImpl), 'ToggleButton');
