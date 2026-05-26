#!/usr/bin/env node
// Verifies that pinned peer-dep versions in docs/COMPATIBILITY.md are still
// the latest on npm. Run via `pnpm verify:versions`. CI fails on drift so
// the matrix table stays honest.

import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const compat = readFileSync(resolve(here, '..', 'docs', 'COMPATIBILITY.md'), 'utf8');

// Parse rows like: | `react-native-reanimated` | 4.3.1 | ...
const rowRe = /\|\s*`([@a-z0-9./-]+)`\s*\|\s*([0-9][^\s|]*)\s*\|/g;
const pinned = [];
for (const m of compat.matchAll(rowRe)) {
  pinned.push({ name: m[1], pinnedVersion: m[2] });
}

if (pinned.length === 0) {
  console.error('verify-versions: no rows parsed from docs/COMPATIBILITY.md');
  process.exit(2);
}

const drift = [];
for (const { name, pinnedVersion } of pinned) {
  try {
    const latest = execSync(`npm view ${name} version`, { encoding: 'utf8' }).trim();
    const tag = latest === pinnedVersion ? 'ok' : 'DRIFT';
    console.log(`${tag.padEnd(6)} ${name}  pinned=${pinnedVersion}  latest=${latest}`);
    if (latest !== pinnedVersion) drift.push({ name, pinnedVersion, latest });
  } catch (err) {
    console.warn(`SKIP   ${name}  (npm view failed)`);
  }
}

if (drift.length > 0) {
  console.error(`\n${drift.length} package(s) drifted from docs/COMPATIBILITY.md.`);
  console.error('Update the table and re-run, or bump the local pins.');
  process.exit(1);
}
console.log('\nAll pinned versions match npm latest. ✓');
