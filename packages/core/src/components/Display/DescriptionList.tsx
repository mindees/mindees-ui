import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Text } from '../Text/Text';

export interface DescriptionListItem {
  /** The term being described (rendered as a label). */
  readonly term: React.ReactNode;
  /** The description of the term. */
  readonly description: React.ReactNode;
}

export interface DescriptionListProps extends Omit<ViewProps, 'style'> {
  readonly items: readonly DescriptionListItem[];
  readonly style?: StyleProp<ViewStyle>;
}

const DescriptionListImpl = React.forwardRef<View, DescriptionListProps>(
  function DescriptionList(props, ref) {
    const { items, style, ...rest } = props;
    const tokens = useTokens();
    const pairStyle: ViewStyle = { gap: tokens.space['3xs'] };
    return (
      <View ref={ref} accessibilityRole="list" style={[{ gap: tokens.space.md }, style]} {...rest}>
        {items.map((item, i) => (
          <View key={i} accessibilityRole="none" style={pairStyle}>
            {typeof item.term === 'string' ? (
              <Text variant="label" tone="muted" weight="semibold">
                {item.term}
              </Text>
            ) : (
              item.term
            )}
            {typeof item.description === 'string' ? (
              <Text tone="primary">{item.description}</Text>
            ) : (
              item.description
            )}
          </View>
        ))}
      </View>
    );
  },
);

DescriptionListImpl.displayName = 'DescriptionList';

export const DescriptionList = tagComponent(DescriptionListImpl, 'DescriptionList');
