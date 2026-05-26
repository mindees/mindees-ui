## What

<!-- 1-3 sentences. What does this PR do? -->

## Why

<!-- The motivation. Link the issue if there is one. -->

## Quality gate checklist

- [ ] Types are strict; no `any` in public API
- [ ] Lint is clean (`pnpm lint`)
- [ ] Tests added / updated (`pnpm test`); coverage stays ≥ 90%
- [ ] Layout-intelligence behavior documented and tested (if applicable)
- [ ] Storybook story added / updated (if applicable)
- [ ] A11y: role + label + focus + reduced-motion + RTL + dynamic-type checked
- [ ] Bundle budget respected (`pnpm build && node scripts/check-bundle-budget.mjs`)
- [ ] `pnpm changeset` run if this affects a published package
- [ ] Docs page updated (if applicable)
