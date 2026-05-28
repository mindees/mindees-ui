import { measureRenders } from 'reassure';

import { Button } from '../Button/Button';
import { Stack } from '../Stack/Stack';
import { Text } from '../Text/Text';

// Reassure render-timing baselines for the hottest primitives. These run under
// `pnpm test:perf` (reassure), not the regular Jest suite. Components fall back
// to the default light theme without a ThemeProvider, so no wrapper is needed.

test('Button render', async () => {
  await measureRenders(<Button>Continue</Button>);
});

test('Stack with auto-spacing render', async () => {
  await measureRenders(
    <Stack>
      <Text>One</Text>
      <Text>Two</Text>
      <Text>Three</Text>
    </Stack>,
  );
});
