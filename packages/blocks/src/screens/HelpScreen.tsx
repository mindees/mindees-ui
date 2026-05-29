import { space } from '@mindees/tokens';
import {
  Accordion,
  Box,
  Button,
  Divider,
  EmptyState,
  ScreenWrapper,
  SearchInput,
  Text,
  TopBar,
  VStack,
} from '@mindees/ui';
import * as React from 'react';
import { ScrollView, type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

export interface HelpFaq {
  /** The question shown as the accordion header. */
  readonly question: string;
  /** The answer revealed when the accordion is open. */
  readonly answer: string;
}

export interface HelpScreenProps {
  /** FAQ entries rendered as an accordion list. */
  readonly faqs: readonly HelpFaq[];
  /** Header title. Defaults to "Help". */
  readonly title?: string;
  /** Placeholder shown in the search field. Defaults to "Search help…". */
  readonly searchPlaceholder?: string;
  /** Label for the contact-support button. Defaults to "Contact support". */
  readonly contactLabel?: string;
  /** Called when the contact-support button is pressed. The button is omitted when absent. */
  readonly onContactSupport?: () => void;
  /** Style spread onto the root screen. */
  readonly style?: StyleProp<ViewStyle>;
}

const staticStyles = StyleSheet.create({
  root: { flex: 1 },
  content: { flexGrow: 1, padding: space.md },
  state: { flex: 1 },
});

const HelpScreenImpl = React.forwardRef<View, HelpScreenProps>(function HelpScreen(props, ref) {
  const {
    faqs,
    title = 'Help',
    searchPlaceholder = 'Search help…',
    contactLabel = 'Contact support',
    onContactSupport,
    style,
  } = props;
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length === 0) return faqs;
    return faqs.filter(
      (faq) => faq.question.toLowerCase().includes(q) || faq.answer.toLowerCase().includes(q),
    );
  }, [faqs, query]);

  return (
    <Box ref={ref} style={[staticStyles.root, style]}>
      <ScreenWrapper edges={EDGES}>
        <TopBar title={title} />
        <ScrollView
          contentContainerStyle={staticStyles.content}
          keyboardShouldPersistTaps="handled"
        >
          <VStack gap="md">
            <SearchInput value={query} onChangeText={setQuery} placeholder={searchPlaceholder} />
            {filtered.length === 0 ? (
              <EmptyState
                style={staticStyles.state}
                title="No matching topics"
                description="Try a different search term or contact support."
              />
            ) : (
              <VStack gap="2xs">
                {filtered.map((faq, i) => (
                  <View key={faq.question}>
                    {i > 0 ? <Divider /> : null}
                    <Accordion title={faq.question}>
                      <Text variant="body" tone="secondary">
                        {faq.answer}
                      </Text>
                    </Accordion>
                  </View>
                ))}
              </VStack>
            )}
            {onContactSupport ? (
              <Button variant="outline" tone="neutral" onPress={onContactSupport}>
                {contactLabel}
              </Button>
            ) : null}
          </VStack>
        </ScrollView>
      </ScreenWrapper>
    </Box>
  );
});

const EDGES = ['top', 'left', 'right', 'bottom'] as const;

HelpScreenImpl.displayName = 'HelpScreen';

/** Help screen: searchable FAQ accordion list + optional contact action. */
export const HelpScreen = React.memo(HelpScreenImpl);
