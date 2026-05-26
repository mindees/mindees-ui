<p align="center">
  <img src="https://raw.githubusercontent.com/mindees/mindees-ui/main/mindees-logo.png" alt="MindeesUI" width="96" height="96" />
</p>

# @mindees/tokens

Design tokens for MindeesUI: colour scales + semantic mappings, typography, spacing, radii, shadows, motion, breakpoints, z-index, and density.

Tokens are framework-agnostic TypeScript — they can be consumed by `@mindees/ui` components, by your own components, and by the docs site.

```ts
import { semanticLight, space, textStyles, radii, shadows } from '@mindees/tokens';
```

Or via subpath imports for the smallest possible bundle:

```ts
import { space } from '@mindees/tokens/spacing';
```

All exports are immutable (`as const`) and `sideEffects: false`.
