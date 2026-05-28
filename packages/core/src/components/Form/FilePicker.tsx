import * as React from 'react';
import { type View } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button, type ButtonBaseProps } from '../Button/Button';
import { MissingPeer, tryLoadPeer } from '../Specialised/optionalPeer';

/** A picked file. Mirrors the relevant subset of expo-document-picker's asset. */
export interface PickedFile {
  readonly uri: string;
  readonly name?: string;
  readonly mimeType?: string;
  readonly size?: number;
}

export interface FilePickerProps extends Omit<ButtonBaseProps, 'onPress' | 'children'> {
  /** Fired with the picked file(s). Empty array when the user cancels. */
  readonly onPick?: (files: readonly PickedFile[]) => void;
  /** Allow selecting more than one file. */
  readonly multiple?: boolean;
  /** Restrict selectable MIME type(s). Forwarded to the picker. */
  readonly type?: string | readonly string[];
  /** Copy the picked file into the app cache directory. Defaults to true. */
  readonly copyToCacheDirectory?: boolean;
  /** Trigger label. Defaults to "Choose file". */
  readonly children?: React.ReactNode;
}

// The picker module is resolved dynamically, so its result is `unknown` until
// we narrow it. This shape is the documented `getDocumentAsync` return.
interface DocumentPickerModule {
  getDocumentAsync: (options: {
    multiple?: boolean;
    type?: string | readonly string[];
    copyToCacheDirectory?: boolean;
  }) => Promise<unknown>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

// Narrow the dynamic picker result into typed files without trusting its shape.
function toFiles(result: unknown): readonly PickedFile[] {
  if (!isRecord(result)) return [];
  if (result.canceled === true) return [];
  const assets = result.assets;
  if (!Array.isArray(assets)) return [];
  const files: PickedFile[] = [];
  for (const asset of assets) {
    if (!isRecord(asset) || typeof asset.uri !== 'string') continue;
    files.push({
      uri: asset.uri,
      name: typeof asset.name === 'string' ? asset.name : undefined,
      mimeType: typeof asset.mimeType === 'string' ? asset.mimeType : undefined,
      size: typeof asset.size === 'number' ? asset.size : undefined,
    });
  }
  return files;
}

const FilePickerImpl = React.forwardRef<View, FilePickerProps>(function FilePicker(props, ref) {
  const {
    onPick,
    multiple = false,
    type,
    copyToCacheDirectory = true,
    children = 'Choose file',
    ...rest
  } = props;

  const peer = tryLoadPeer<DocumentPickerModule>(
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    () => require('expo-document-picker') as DocumentPickerModule,
  );

  const handlePress = React.useCallback(() => {
    if (!peer) return;
    void peer
      .getDocumentAsync({ multiple, type, copyToCacheDirectory })
      .then((result) => {
        onPick?.(toFiles(result));
      })
      .catch(() => {
        onPick?.([]);
      });
  }, [peer, onPick, multiple, type, copyToCacheDirectory]);

  if (!peer) {
    return (
      <MissingPeer
        peer="expo-document-picker"
        install="pnpm add expo-document-picker"
        label="FilePicker requires expo-document-picker"
      />
    );
  }

  return (
    <Button ref={ref} onPress={handlePress} {...rest}>
      {children}
    </Button>
  );
});

FilePickerImpl.displayName = 'FilePicker';

const FilePickerMemo = React.memo(FilePickerImpl);
FilePickerMemo.displayName = 'FilePicker';

export const FilePicker = tagComponent(FilePickerMemo, 'FilePicker');
