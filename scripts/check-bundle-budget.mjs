#!/usr/bin/env node
// Per-component bundle budget guard. Inspects the built ESM output of
// @mindees/ui and fails CI if any single re-exportable subpath grows beyond
// the documented budget. Budgets are deliberately tight to enforce
// tree-shakeability: anything not tree-shakeable will blow past these.

import { readFileSync, statSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = resolve(fileURLToPath(import.meta.url), '..');
const moduleDir = resolve(here, '..', 'packages', 'core', 'lib', 'module');

// gzip-ish target; raw file-size is a cheap proxy and works without extra deps
const BUDGETS_BYTES = {
  'index.js': 80_000, // Phase 1 surface; will grow as Phases 2-6 land
  'theme/index.js': 16_000,
  'layout-intelligence/index.js': 16_000,
  'providers/index.js': 12_000,
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
  console.error('\nBundle budget exceeded. Either trim the addition or bump the budget intentionally.');
  process.exit(1);
}
console.log('\nAll bundle budgets met. ✓');
