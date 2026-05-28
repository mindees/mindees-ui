import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';

import { Button, type ButtonBaseProps } from './Button';
import { GlyphAffordance } from './internal/GlyphAffordance';

export interface UploadButtonProps extends Omit<ButtonBaseProps, 'children' | 'onPress'> {
  /** Invoked when the button is pressed. Visual affordance only — no FS access. */
  readonly onUpload?: () => void;
  /** Label text. Defaults to "Upload". */
  readonly children?: React.ReactNode;
}

const UploadButtonImpl = React.forwardRef<View, UploadButtonProps>(
  function UploadButton(props, ref) {
    const { onUpload, children = 'Upload', leading, variant, tone, size, ...rest } = props;
    return (
      <Button
        ref={ref}
        onPress={onUpload}
        variant={variant}
        tone={tone}
        size={size}
        leading={leading ?? <GlyphAffordance glyph="↑" variant={variant} tone={tone} size={size} />}
        {...rest}
      >
        {children}
      </Button>
    );
  },
);

UploadButtonImpl.displayName = 'UploadButton';

export const UploadButton = tagComponent(React.memo(UploadButtonImpl), 'UploadButton');
