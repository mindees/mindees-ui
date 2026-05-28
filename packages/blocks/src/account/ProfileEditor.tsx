import { Button, FormField, HStack, Input, Textarea, VStack } from '@mindees/ui';
import * as React from 'react';
import { type StyleProp, StyleSheet, type View, type ViewStyle } from 'react-native';

import { AvatarUploader } from './AvatarUploader';

/** Editable profile fields. All optional so partial forms render cleanly. */
export interface ProfileEditorValues {
  readonly name: string;
  readonly handle: string;
  readonly bio: string;
  /** Avatar image URL. */
  readonly avatar?: string;
}

export interface ProfileEditorProps {
  /** Initial field values. */
  readonly value: ProfileEditorValues;
  /** Called with the current values when the user saves. */
  readonly onSave: (values: ProfileEditorValues) => void;
  /** Called when the user cancels. Hides the cancel button when absent. */
  readonly onCancel?: () => void;
  /** Called when the user requests a new avatar image. */
  readonly onPickAvatar?: () => void;
  /** Disables inputs and shows a spinner on the save button. */
  readonly loading?: boolean;
  /** Label for the save button. Defaults to "Save". */
  readonly saveLabel?: string;
  /** Label for the cancel button. Defaults to "Cancel". */
  readonly cancelLabel?: string;
  /** Style spread onto the root container. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  actions: { justifyContent: 'flex-end' },
});

const ProfileEditorImpl = React.forwardRef<View, ProfileEditorProps>(
  function ProfileEditor(props, ref) {
    const {
      value,
      onSave,
      onCancel,
      onPickAvatar,
      loading = false,
      saveLabel = 'Save',
      cancelLabel = 'Cancel',
      style,
    } = props;

    const [name, setName] = React.useState(value.name);
    const [handle, setHandle] = React.useState(value.handle);
    const [bio, setBio] = React.useState(value.bio);

    const handleSave = React.useCallback(() => {
      onSave({ name: name.trim(), handle: handle.trim(), bio: bio.trim(), avatar: value.avatar });
    }, [name, handle, bio, value.avatar, onSave]);

    return (
      <VStack ref={ref} gap="md" style={style}>
        <AvatarUploader
          uri={value.avatar}
          name={name || value.name}
          onPick={onPickAvatar}
          loading={loading}
        />

        <FormField label="Name">
          <Input
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            disabled={loading}
            returnKeyType="next"
            accessibilityLabel="Name"
          />
        </FormField>

        <FormField label="Username">
          <Input
            value={handle}
            onChangeText={setHandle}
            placeholder="username"
            autoCapitalize="none"
            autoCorrect={false}
            disabled={loading}
            returnKeyType="next"
            accessibilityLabel="Username"
          />
        </FormField>

        <FormField label="Bio">
          <Textarea
            value={bio}
            onChangeText={setBio}
            placeholder="Tell people about yourself"
            disabled={loading}
            rows={4}
            accessibilityLabel="Bio"
          />
        </FormField>

        <HStack gap="sm" style={staticStyles.actions}>
          {onCancel ? (
            <Button variant="ghost" tone="neutral" onPress={onCancel} disabled={loading}>
              {cancelLabel}
            </Button>
          ) : null}
          <Button onPress={handleSave} loading={loading}>
            {saveLabel}
          </Button>
        </HStack>
      </VStack>
    );
  },
);

ProfileEditorImpl.displayName = 'ProfileEditor';

export const ProfileEditor = React.memo(ProfileEditorImpl);
