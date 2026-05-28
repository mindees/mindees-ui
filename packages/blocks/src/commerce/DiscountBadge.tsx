import { Badge } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

export interface DiscountBadgeProps {
  /**
   * Discount percentage (e.g. `20` renders "-20%"). Ignored when `label` is set.
   */
  readonly percent?: number;
  /** Explicit label (e.g. "SALE", "CLEARANCE"). Overrides `percent`. */
  readonly label?: string;
  /** Badge tone. Defaults to "danger" to signal a price drop. */
  readonly tone?: 'danger' | 'success' | 'warning' | 'primary';
  /** Style spread onto the root badge. */
  readonly style?: StyleProp<ViewStyle>;
}

const DiscountBadgeImpl = React.forwardRef<View, DiscountBadgeProps>(
  function DiscountBadge(props, ref) {
    const { percent, label, tone = 'danger', style } = props;
    const text = label ?? (typeof percent === 'number' ? `-${Math.round(percent)}%` : null);
    if (!text) return null;
    return (
      <Badge ref={ref} tone={tone} variant="solid" style={style}>
        {text}
      </Badge>
    );
  },
);

DiscountBadgeImpl.displayName = 'DiscountBadge';

export const DiscountBadge = React.memo(DiscountBadgeImpl);
