import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

import { describeChildren } from '../../layout-intelligence/child-introspection';
import {
  ButtonGroupContext,
  type ButtonGroupContextValue,
} from '../../layout-intelligence/context';
import { tagComponent } from '../../layout-intelligence/tagged-component';

import type { ButtonSize, ButtonVariant } from './Button';

export interface ButtonGroupProps extends ViewProps {
  readonly orientation?: 'horizontal' | 'vertical';
  readonly size?: ButtonSize;
  readonly variant?: ButtonVariant;
  /** When true, children render with shared borders + outer-only rounded corners. Default true. */
  readonly attached?: boolean;
  readonly children?: React.ReactNode;
}

const ButtonGroupImpl = React.forwardRef<View, ButtonGroupProps>(function ButtonGroup(props, ref) {
  const {
    orientation = 'horizontal',
    size = 'md',
    variant = 'solid',
    attached = true,
    children,
    style,
    ...rest
  } = props;
  const slots = describeChildren(children);

  const wrapped = slots.map((slot) => {
    const ctx: ButtonGroupContextValue = {
      orientation,
      size,
      variant,
      attached,
      position: { index: slot.index, isFirst: slot.isFirst, isLast: slot.isLast },
    };
    return (
      <ButtonGroupContext.Provider value={ctx} key={slot.element.key ?? slot.index}>
        {slot.element}
      </ButtonGroupContext.Provider>
    );
  });

  const containerStyle: ViewStyle = {
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
  };

  return (
    <View ref={ref} accessibilityRole="none" style={[containerStyle, style]} {...rest}>
      {wrapped}
    </View>
  );
});

ButtonGroupImpl.displayName = 'ButtonGroup';

export const ButtonGroup = tagComponent(ButtonGroupImpl, 'ButtonGroup');
