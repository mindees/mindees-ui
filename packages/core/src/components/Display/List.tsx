import * as React from 'react';
import { Pressable, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { ListContext, useListContext } from '../../layout-intelligence/context';
import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface ListProps extends Omit<ViewProps, 'style'> {
  readonly density?: 'compact' | 'comfortable' | 'spacious';
  readonly dividers?: boolean;
  readonly interactive?: boolean;
  readonly children?: React.ReactNode;
  readonly style?: StyleProp<ViewStyle>;
}

const ListImpl = React.forwardRef<View, ListProps>(function List(props, ref) {
  const {
    density = 'comfortable',
    dividers = true,
    interactive = false,
    children,
    style,
    ...rest
  } = props;
  const ctx = { density, dividers, interactive };
  return (
    <ListContext.Provider value={ctx}>
      <View ref={ref} accessibilityRole="list" style={style} {...rest}>
        {children}
      </View>
    </ListContext.Provider>
  );
});

ListImpl.displayName = 'List';

export const List = tagComponent(ListImpl, 'List');

// ---- ListItem ----------------------------------------------------------
export interface ListItemProps extends Omit<ViewProps, 'style'> {
  readonly title: React.ReactNode;
  readonly description?: React.ReactNode;
  readonly leading?: React.ReactNode;
  readonly trailing?: React.ReactNode;
  readonly onPress?: () => void;
  readonly disabled?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

const ListItemImpl = React.forwardRef<View, ListItemProps>(function ListItem(props, ref) {
  const {
    title,
    description,
    leading,
    trailing,
    onPress,
    disabled = false,
    style,
    ...rest
  } = props;
  const ctx = useListContext();
  const tokens = useTokens();
  const verticalPad =
    ctx?.density === 'compact'
      ? tokens.space.xs
      : ctx?.density === 'spacious'
        ? tokens.space.lg
        : tokens.space.md;
  const itemStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.space.md,
    paddingVertical: verticalPad,
    gap: tokens.space.sm,
    minHeight: 44,
    borderBottomWidth: ctx?.dividers ? 1 : 0,
    borderBottomColor: tokens.colors.border.subtle,
    opacity: disabled ? 0.5 : 1,
  };
  const inner = (
    <>
      {leading ? <View>{leading}</View> : null}
      <View style={{ flex: 1, gap: tokens.space['3xs'] }}>
        {typeof title === 'string' ? (
          <Text weight="medium" tone="primary">
            {title}
          </Text>
        ) : (
          title
        )}
        {description ? (
          typeof description === 'string' ? (
            <Text variant="caption" tone="muted">
              {description}
            </Text>
          ) : (
            description
          )
        ) : null}
      </View>
      {trailing ? <View>{trailing}</View> : null}
    </>
  );
  if (onPress || ctx?.interactive) {
    return (
      <Pressable
        ref={ref}
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        style={[itemStyle, style]}
        {...rest}
      >
        {inner}
      </Pressable>
    );
  }
  return (
    <View ref={ref} accessibilityRole="none" style={[itemStyle, style]} {...rest}>
      {inner}
    </View>
  );
});

ListItemImpl.displayName = 'ListItem';

export const ListItem = tagComponent(ListItemImpl, 'ListItem');
