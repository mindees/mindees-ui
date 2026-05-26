#!/usr/bin/env node
// Per-subpath bundle budget guard. Inspects @mindees/ui's ESM build and
// fails CI if any tracked subpath grows past its budget. Budgets are
// generous enough not to chase noise, tight enough to catch a
// tree-shake regression or an accidental cross-domain import.
//
// We track barrel files (re-export only) and a representative slice of
// per-component files so a single fat component triggers an alert.

import { statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = resolve(fileURLToPath(import.meta.url), '..');
const moduleDir = resolve(here, '..', 'packages', 'core', 'lib', 'module');

const BUDGETS_BYTES = {
  // Subpath barrels — these are re-exports only and should stay tiny.
  'index.js': 4_000,
  'theme/index.js': 1_000,
  'layout-intelligence/index.js': 2_000,
  'providers/index.js': 1_000,
  'styling/index.js': 1_000,
  'a11y/index.js': 1_000,
  'components/index.js': 2_000,
  // Per-component upper bounds. Catches an accidental cross-import that
  // pulls in unrelated code.
  'components/Box/Box.js': 10_000,
  'components/Stack/Stack.js': 8_000,
  'components/Button/Button.js': 12_000,
  'components/Nav/PillTabBar.js': 16_000,
  'components/Form/FormField.js': 6_000,
  'components/Overlay/Modal.js': 6_000,
};

let failed = false;
for (const [rel, budget] of Object.entries(BUDGETS_BYTES)) {
  const path = join(moduleDir, rel);
  try {
    const { size } = statSync(path);
    const ok = size <= budget;
    const tag = ok ? 'ok' : 'OVER';
    console.log(`${tag.padEnd(6)} ${rel}  ${size}B  (budget ${budget}B)`);
    if (!ok) failed = true;
  } catch {
    console.warn(`SKIP   ${rel}  (not built)`);
  }
}

if (failed) {
  console.error(
    '\nBundle budget exceeded. Either trim the addition or bump the budget intentionally with a note in the commit.',
  );
  process.exit(1);
}
console.log('\nAll bundle budgets met. ✓');
