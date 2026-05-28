import { Button, Grid, VStack } from '@mindees/ui';
import * as React from 'react';
import { type View, type StyleProp, type ViewStyle } from 'react-native';

/** A single social/SSO provider rendered as a button. */
export interface SocialProvider {
  /** Stable React key (e.g. "google", "apple"). */
  readonly key: string;
  /** Visible button label. */
  readonly label: string;
  /** Optional leading glyph/icon element. */
  readonly icon?: React.ReactNode;
  /** Pressed handler for this provider. */
  readonly onPress: () => void;
  /** Disable this provider only. */
  readonly disabled?: boolean;
}

export interface SocialLoginButtonsProps {
  /** Providers to render, in display order. */
  readonly providers: readonly SocialProvider[];
  /** Layout: a single vertical column or a multi-column grid. Defaults to "vertical". */
  readonly layout?: 'vertical' | 'grid';
  /** Column count when `layout` is "grid". Defaults to 2. */
  readonly columns?: number;
  /** Disable every provider button. */
  readonly disabled?: boolean;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

interface ProviderButtonProps {
  readonly provider: SocialProvider;
  readonly disabled: boolean;
}

const ProviderButton = React.memo(function ProviderButton(props: ProviderButtonProps) {
  const { provider, disabled } = props;
  // `provider.onPress` is referentially stable from the caller; passing it
  // straight through avoids allocating a wrapper closure per render.
  return (
    <Button
      variant="outline"
      tone="neutral"
      onPress={provider.onPress}
      disabled={disabled || provider.disabled}
      leading={provider.icon}
      fullWidth
      accessibilityLabel={provider.label}
    >
      {provider.label}
    </Button>
  );
});

const SocialLoginButtonsImpl = React.forwardRef<View, SocialLoginButtonsProps>(
  function SocialLoginButtons(props, ref) {
    const { providers, layout = 'vertical', columns = 2, disabled = false, style } = props;

    const buttons = providers.map((provider) => (
      <ProviderButton key={provider.key} provider={provider} disabled={disabled} />
    ));

    if (layout === 'grid') {
      return (
        <Grid ref={ref} columns={columns} gap="sm" style={style}>
          {buttons}
        </Grid>
      );
    }

    return (
      <VStack ref={ref} gap="sm" style={style}>
        {buttons}
      </VStack>
    );
  },
);

SocialLoginButtonsImpl.displayName = 'SocialLoginButtons';

export const SocialLoginButtons = React.memo(SocialLoginButtonsImpl);
