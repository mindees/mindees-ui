# @mindees/icons

Tree-shakeable icon set for MindeesUI, built on `react-native-svg`. Each icon is a named export.

```tsx
import { CheckIcon } from '@mindees/icons';

<CheckIcon size={20} color="green" />
```

Bring your own icon with the `createIcon` factory:

```tsx
import { createIcon } from '@mindees/icons';

export const MyIcon = createIcon({
  name: 'MyIcon',
  viewBox: '0 0 24 24',
  path: 'M12 2L2 22h20L12 2z',
});
```
