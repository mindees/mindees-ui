import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';

import { KeyValueRow } from './KeyValueRow';

export interface DetailViewItem {
  readonly label: React.ReactNode;
  readonly value: React.ReactNode;
}

export interface DetailViewProps extends Omit<ViewProps, 'style'> {
  /** Label/value rows describing a single record. */
  readonly items: readonly DetailViewItem[];
  /** Draw hairline dividers between rows. Defaults to true. */
  readonly dividers?: boolean;
  readonly style?: StyleProp<ViewStyle>;
}

const DetailViewImpl = React.forwardRef<View, DetailViewProps>(function DetailView(props, ref) {
  const { items, dividers = true, style, ...rest } = props;
  const tokens = useTokens();
  const lastIndex = items.length - 1;
  return (
    <View
      ref={ref}
      accessibilityRole="list"
      style={[{ gap: dividers ? 0 : tokens.space['3xs'] }, style]}
      {...rest}
    >
      {items.map((item, i) => (
        <KeyValueRow
          key={i}
          label={item.label}
          value={item.value}
          divider={dividers && i !== lastIndex}
        />
      ))}
    </View>
  );
});

DetailViewImpl.displayName = 'DetailView';

export const DetailView = tagComponent(DetailViewImpl, 'DetailView');
