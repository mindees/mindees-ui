# Changesets

This directory holds [Changesets](https://github.com/changesets/changesets) — short markdown files describing version-bump intent for the published packages (`@mindees/ui`, `@mindees/tokens`, `@mindees/icons`).

Create one with:

```sh
pnpm changeset
```

The release workflow (`.github/workflows/ci.yml`) runs `pnpm release` on `main`, which calls `changesets publish` after a build.
