import { Text, View } from 'react-native';
import { useTheme } from '@mindees/ui';

export default function Home(): React.ReactElement {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        padding: theme.tokens.space.lg,
        backgroundColor: theme.tokens.colors.background.canvas,
        gap: theme.tokens.space.md,
      }}
    >
      <Text
        style={{
          ...theme.tokens.textStyles.h1,
          color: theme.tokens.colors.text.primary,
          fontWeight: theme.tokens.textStyles.h1.weight,
        }}
      >
        MindeesUI
      </Text>
      <Text
        style={{
          ...theme.tokens.textStyles.body,
          color: theme.tokens.colors.text.secondary,
          fontWeight: theme.tokens.textStyles.body.weight,
        }}
      >
        Phase 1 kitchen-sink is here. Component primitives land in Phase 2.
      </Text>
    </View>
  );
}
