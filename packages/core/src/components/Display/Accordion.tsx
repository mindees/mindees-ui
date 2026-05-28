import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { ChevronDownIcon, ChevronRightIcon } from '@mindees/icons';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface AccordionProps extends Omit<ViewProps, 'style'> {
  readonly title: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly defaultOpen?: boolean;
  readonly open?: boolean;
  readonly onOpenChange?: (next: boolean) => void;
  readonly style?: StyleProp<ViewStyle>;
}

const AccordionImpl = React.forwardRef<View, AccordionProps>(function Accordion(props, ref) {
  const { title, children, defaultOpen = false, open, onOpenChange, style, ...rest } = props;
  const [internal, setInternal] = React.useState(defaultOpen);
  const isOpen = open ?? internal;
  const tokens = useTokens();

  const toggle = React.useCallback(() => {
    const next = !isOpen;
    if (open === undefined) setInternal(next);
    onOpenChange?.(next);
  }, [isOpen, open, onOpenChange]);

  const headerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.space.sm,
    gap: tokens.space['2xs'],
  };

  const bodyStyle: ViewStyle = {
    paddingBottom: tokens.space.sm,
  };

  return (
    <View ref={ref} accessibilityRole="none" style={style} {...rest}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
        onPress={toggle}
        style={headerStyle}
      >
        {isOpen ? (
          <ChevronDownIcon size={16} color={tokens.colors.text.primary} />
        ) : (
          <ChevronRightIcon size={16} color={tokens.colors.text.primary} />
        )}
        {typeof title === 'string' ? <Text weight="semibold">{title}</Text> : title}
      </Pressable>
      {isOpen ? <View style={bodyStyle}>{children}</View> : null}
    </View>
  );
});

AccordionImpl.displayName = 'Accordion';

export const Accordion = tagComponent(AccordionImpl, 'Accordion');
