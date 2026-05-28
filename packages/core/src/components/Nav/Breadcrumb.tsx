import * as React from 'react';
import { View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { useTokens } from '../../theme/ThemeProvider';
import { Link } from '../Text/Link';
import { Text } from '../Text/Text';

export interface BreadcrumbItem {
  readonly label: string;
  readonly href?: string;
  readonly onPress?: () => void;
}

export interface BreadcrumbProps extends ViewProps {
  readonly items: readonly BreadcrumbItem[];
  /** Single-character separator. Defaults to `/`. */
  readonly separator?: string;
  readonly style?: StyleProp<ViewStyle>;
}

const BreadcrumbImpl = React.forwardRef<View, BreadcrumbProps>(function Breadcrumb(props, ref) {
  const { items, separator = '/', style, ...rest } = props;
  const tokens = useTokens();
  const row: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: tokens.space['2xs'],
  };
  const lastIndex = items.length - 1;
  return (
    <View ref={ref} accessibilityRole="none" style={[row, style]} {...rest}>
      {items.map((item, i) => {
        const isLast = i === lastIndex;
        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {isLast ? (
              <Text tone="primary" weight="semibold" accessibilityLabel={item.label}>
                {item.label}
              </Text>
            ) : (
              <Link href={item.href} onPress={item.onPress} hideUnderline>
                {item.label}
              </Link>
            )}
            {!isLast ? (
              <Text tone="muted" accessibilityElementsHidden>
                {separator}
              </Text>
            ) : null}
          </React.Fragment>
        );
      })}
    </View>
  );
});

BreadcrumbImpl.displayName = 'Breadcrumb';

export const Breadcrumb = tagComponent(BreadcrumbImpl, 'Breadcrumb');
