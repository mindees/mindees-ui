import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Button, type ButtonBaseProps } from './Button';
import { GlyphAffordance } from './internal/GlyphAffordance';

export interface DownloadButtonProps extends Omit<ButtonBaseProps, 'children' | 'onPress'> {
  /** Invoked when the button is pressed. Visual affordance only — no FS access. */
  readonly onDownload?: () => void;
  /** Label text. Defaults to "Download". */
  readonly children?: React.ReactNode;
}

const DownloadButtonImpl = React.forwardRef<View, DownloadButtonProps>(
  function DownloadButton(props, ref) {
    const { onDownload, children = 'Download', leading, variant, tone, size, ...rest } = props;
    return (
      <Button
        ref={ref}
        onPress={onDownload}
        variant={variant}
        tone={tone}
        size={size}
        leading={leading ?? <GlyphAffordance glyph="↓" variant={variant} tone={tone} size={size} />}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

DownloadButtonImpl.displayName = 'DownloadButton';

export const DownloadButton = tagComponent(React.memo(DownloadButtonImpl), 'DownloadButton');
