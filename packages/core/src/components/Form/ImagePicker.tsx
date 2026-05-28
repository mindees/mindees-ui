import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button, type ButtonBaseProps } from '../Button/Button';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

/** A picked image. Mirrors the relevant subset of expo-image-picker's asset. */
export interface PickedImage {
  readonly uri: string;
  readonly fileName?: string;
  readonly mimeType?: string;
  readonly width?: number;
  readonly height?: number;
  readonly fileSize?: number;
}

export interface ImagePickerProps extends Omit<ButtonBaseProps, 'onPress' | 'children'> {
  /** Fired with the picked image(s). Empty array when the user cancels. */
  readonly onPick?: (images: readonly PickedImage[]) => void;
  /** Allow selecting more than one image. */
  readonly allowsMultipleSelection?: boolean;
  /** JPEG/PNG compression quality, 0–1. Forwarded to the picker. */
  readonly quality?: number;
  /** Show the in-picker crop/edit UI before returning. */
  readonly allowsEditing?: boolean;
  /** Trigger label. Defaults to "Choose image". */
  readonly children?: React.ReactNode;
}

// Resolved dynamically, so the result is `unknown` until narrowed. This shape
// is the documented `launchImageLibraryAsync` return.
interface ImagePickerModule {
  launchImageLibraryAsync: (options: {
    allowsMultipleSelection?: boolean;
    quality?: number;
    allowsEditing?: boolean;
  }) => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Narrow the dynamic picker result into typed images without trusting its shape.
function toImages(result: unknown): readonly PickedImage[] {
  if (!isRecord(result)) return [];
  if (result.canceled === true) return [];
  const assets = result.assets;
  if (!Array.isArray(assets)) return [];
  const images: PickedImage[] = [];
  for (const asset of assets) {
    if (!isRecord(asset) || typeof asset.uri !== 'string') continue;
    images.push({
      uri: asset.uri,
      fileName: typeof asset.fileName === 'string' ? asset.fileName : undefined,
      mimeType: typeof asset.mimeType === 'string' ? asset.mimeType : undefined,
      width: typeof asset.width === 'number' ? asset.width : undefined,
      height: typeof asset.height === 'number' ? asset.height : undefined,
      fileSize: typeof asset.fileSize === 'number' ? asset.fileSize : undefined,
    });
  }
  return images;
}

const ImagePickerImpl = React.forwardRef<View, ImagePickerProps>(function ImagePicker(props, ref) {
  const {
    onPick,
    allowsMultipleSelection = false,
    quality,
    allowsEditing,
    children = 'Choose image',
    ...rest
  } = props;

  const peer = tryLoadPeer<ImagePickerModule>(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('expo-image-picker') as ImagePickerModule,
  );

  const handlePress = React.useCallback(() => {
    if (!peer) return;
    void peer
      .launchImageLibraryAsync({ allowsMultipleSelection, quality, allowsEditing })
      .then((result) => {
        onPick?.(toImages(result));
      })
      .catch(() => {
        onPick?.([]);
      });
  }, [peer, onPick, allowsMultipleSelection, quality, allowsEditing]);

  if (!peer) {
    return (
      <MissingPeer
        peer="expo-image-picker"
        install="pnpm add expo-image-picker"
        label="ImagePicker requires expo-image-picker"
      />
    );
  }

  return (
    <Button ref={ref} onPress={handlePress} {...rest}>
      {children}
    </Button>
  );
});

ImagePickerImpl.displayName = 'ImagePicker';

const ImagePickerMemo = React.memo(ImagePickerImpl);
ImagePickerMemo.displayName = 'ImagePicker';

export const ImagePicker = tagComponent(ImagePickerMemo, 'ImagePicker');
