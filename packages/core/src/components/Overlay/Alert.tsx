import * as React from 'react';
import { type StyleProp, type View, type ViewStyle } from 'react-native';

import { tagComponent } from '../../layout-intelligence/tagged-component';
import { Button, type ButtonTone } from '../Button/Button';
import { ButtonGroup } from '../Button/ButtonGroup';
import { Stack } from '../Stack/Stack';
import { Heading } from '../Text/Heading';
import { Text } from '../Text/Text';

import { Modal } from './Modal';

export interface AlertAction {
  readonly label: string;
  readonly onPress?: () => void;
  readonly tone?: ButtonTone;
}

export interface AlertProps {
  readonly visible: boolean;
  readonly onClose: () => void;
  readonly title: string;
  readonly description?: string;
  /** Action buttons rendered at the bottom. Last is the primary. Defaults to a single OK action. */
  readonly actions?: readonly AlertAction[];
  /** Style applied to the elevated dialog panel (not the backdrop/scrim). */
  readonly style?: StyleProp<ViewStyle>;
}

const AlertImpl = React.forwardRef<View, AlertProps>(function Alert(props, ref) {
  const { visible, onClose, title, description, actions, style } = props;
  const resolvedActions: readonly AlertAction[] = actions ?? [{ label: 'OK', onPress: onClose }];

  return (
    <Modal
      ref={ref}
      visible={visible}
      onClose={onClose}
      centered
      accessibilityLabel={title}
      style={style}
    >
      <Stack gap="sm">
        <Heading level={3}>{title}</Heading>
        {description ? <Text tone="secondary">{description}</Text> : null}
        <ButtonGroup orientation="horizontal" attached={false}>
          {resolvedActions.map((a, i) => (
            <Button
              key={`${a.label}-${i}`}
              variant={i === resolvedActions.length - 1 ? 'solid' : 'ghost'}
              tone={a.tone ?? 'primary'}
              onPress={a.onPress}
            >
              {a.label}
            </Button>
          ))}
        </ButtonGroup>
      </Stack>
    </Modal>
  );
});

AlertImpl.displayName = 'Alert';

export const Alert = tagComponent(AlertImpl, 'Alert');
