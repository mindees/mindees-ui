import * as React from 'react';
import { View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

export interface TopBarProps {
  readonly title?: string;
  readonly subtitle?: string;
  readonly leading?: React.ReactNode;
  readonly trailing?: React.ReactNode;
  /** Center the title between leading and trailing slots (iOS convention). Defaults to true. */
  readonly centerTitle?: boolean;
}

const TopBarImpl = React.forwardRef<View, TopBarProps>(function TopBar(props, ref) {
  const { title, subtitle, leading, trailing, centerTitle = true } = props;
  const tokens = useTokens();
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    paddingHorizontal: tokens.space.sm,
    backgroundColor: tokens.colors.background.elevated,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border.subtle,
    gap: tokens.space.xs,
  };

  return (
    <View ref={ref} accessibilityRole="header" style={containerStyle}>
      <View style={{ minWidth: 40, alignItems: 'flex-start' }}>{leading}</View>
      <View
        style={{
          flex: 1,
          alignItems: centerTitle ? 'center' : 'flex-start',
        }}
      >
        {title ? (
          <Heading level={5} numberOfLines={1}>
            {title}
          </Heading>
        ) : null}
        {subtitle ? (
          <Text variant="caption" tone="muted" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ minWidth: 40, alignItems: 'flex-end' }}>{trailing}</View>
    </View>
  );
});

TopBarImpl.displayName = 'TopBar';

export const TopBar = tagComponent(TopBarImpl, 'TopBar');
