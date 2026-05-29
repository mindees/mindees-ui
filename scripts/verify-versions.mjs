#!/usr/bin/env node
// Reports whether the peer-dep versions documented in docs/COMPATIBILITY.md
// are still the latest on npm. Run via `pnpm verify:versions`.
//
// COMPATIBILITY.md is a "verified on <date>" snapshot, and our peer ranges are
// intentionally wide, so an upstream release is EXPECTED drift — not a build
// error. By default this prints the drift report and exits 0 (informational).
// Pass `--strict` (or set VERIFY_VERSIONS_STRICT=true) to fail on drift, e.g.
// in a scheduled "are our docs stale?" check rather than the per-push gate.

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

const strict = process.argv.includes('--strict') || process.env.VERIFY_VERSIONS_STRICT === 'true';

if (drift.length > 0) {
  const msg = `\n${drift.length} package(s) drifted from docs/COMPATIBILITY.md (verified-on snapshot).`;
  if (strict) {
    console.error(msg);
    console.error('Strict mode: update the table or bump the local pins, then re-run.');
    process.exit(1);
  }
  console.warn(msg);
  console.warn('Informational only — peer ranges are wide. Refresh the table when convenient.');
  process.exit(0);
}
console.log('\nAll pinned versions match npm latest. ✓');
