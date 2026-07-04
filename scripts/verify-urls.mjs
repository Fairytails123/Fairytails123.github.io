#!/usr/bin/env node
// URL-manifest gate (WEBSITE-PLAN.md): every legacy URL must keep resolving.
//   --dist  : checks the local dist/ output (gates every page sign-off)
//   --live  : checks the live domain over HTTP (gates + confirms DNS cutover)
//
// Entry statuses: 'built' entries FAIL the run when missing; 'planned' entries
// only warn. Flip planned -> built as each page ships.

import { existsSync } from 'node:fs';
import { join } from 'node:path';

const SITE = 'https://www.thefairytails.co.uk';
const DIST = join(import.meta.dirname, '..', 'dist');

/** @type {{path: string, type: 'page'|'stub'|'gone', status: 'built'|'planned'}[]} */
const MANIFEST = [
  // ---- rebuilt pages (final 200s) ----
  { path: '/', type: 'page', status: 'built' }, // homepage (built 2026-07-02, LAST in the inside-out order)
  { path: '/dog-boarding-school', type: 'page', status: 'built' },
  { path: '/intensive-dog-training', type: 'page', status: 'built' },
  { path: '/dog-day-school', type: 'page', status: 'built' },
  { path: '/puppy-training-classes', type: 'page', status: 'planned' },
  { path: '/training-plans', type: 'page', status: 'planned' },
  { path: '/membership-plans', type: 'page', status: 'planned' },
  { path: '/puppycourse', type: 'page', status: 'planned' },
  { path: '/blog', type: 'page', status: 'built' }, // advice hub (built 2026-07-04)
  { path: '/gallery', type: 'page', status: 'built' },
  { path: '/contact', type: 'page', status: 'built' }, // built 2026-07-04
  { path: '/terms-and-conditions', type: 'page', status: 'built' }, // built 2026-07-04
  // ---- blog posts (root-level slugs, filename = slug; 19 legacy posts built
  //      2026-07-04 with ORIGINAL 2020-2025 publish dates preserved, plus new
  //      posts appended as written) ----
  ...[
    'animal-management-qualification-jobs', // NEW post, published 2026-07-04
    'archiestory',
    'training-is-not-working',
    'board-and-train-intensive-dog-training-program',
    'dog-parks-in-london-a-dog-s-guide-to-the-city-s-green-spaces',
    'puppy-daycare-benefits-shaping-happy-confident-canines',
    'building-a-relationship-with-your-dog',
    'certified-dog-trainer',
    'dogs-reacting-to-the-noises-and-activities-that-occur-by-the-door',
    'frustration-in-dogs-dog-training',
    'fear-and-anxiety-in-dogs',
    'force-free-trainers-v-balanced-dog-trainers',
    'how-to-crate-train-your-dog',
    'fear-anxiety-humans-and-dogs-with-cer',
    'dog-barking',
    'the-importance-of-toys-in-your-dog-s-life',
    'how-to-desensitise-your-pet-to-fireworks',
    'why-dog-grooming-is-important',
    'why-your-dog-is-pulling-on-the-leash',
    '15-food-items-to-avoid',
  ].map((slug) => ({ path: `/${slug}`, type: 'page', status: 'built' })),
  // ---- meta-refresh stubs (Astro redirects — generated since Stage 1) ----
  { path: '/puppy-classes', type: 'stub', status: 'built' },
  { path: '/training-stages', type: 'stub', status: 'built' },
  { path: '/admission-process', type: 'stub', status: 'built' },
  { path: '/boarding-information', type: 'stub', status: 'built' },
  { path: '/resources-collection', type: 'stub', status: 'built' },
  { path: '/puppy-week-1', type: 'stub', status: 'built' },
  { path: '/week-2-puppy', type: 'stub', status: 'built' },
  { path: '/puppy-week-3', type: 'stub', status: 'built' },
  { path: '/puppy-week-4', type: 'stub', status: 'built' },
  { path: '/puppy-toilet-schdule', type: 'stub', status: 'built' }, // typo slug is verbatim-correct
  // ---- value-added tools (standalone, self-contained, served verbatim from public/) ----
  { path: '/breed-matcher/', type: 'page', status: 'built' }, // tools/breed-matcher -> public/breed-matcher/index.html
  // ---- intentional 404s ----
  { path: '/staff-resources', type: 'gone', status: 'built' },
  { path: '/internal-management-resources', type: 'gone', status: 'built' },
  { path: '/feed/rss2', type: 'gone', status: 'built' },
  { path: '/feed/atom', type: 'gone', status: 'built' },
];

const mode = process.argv.includes('--live') ? 'live' : 'dist';

function distFile(p) {
  if (p === '/') return join(DIST, 'index.html');
  // a trailing slash = a static directory index (e.g. /breed-matcher/ -> dist/breed-matcher/index.html)
  if (p.endsWith('/')) return join(DIST, p.slice(1, -1), 'index.html');
  return join(DIST, `${p.slice(1)}.html`);
}

let fail = 0;
let warn = 0;

if (mode === 'live') {
  for (const entry of MANIFEST) {
    const url = `${SITE}${entry.path === '/' ? '' : entry.path}`;
    let status = 0;
    try {
      const res = await fetch(url, { redirect: 'manual' });
      status = res.status;
    } catch (e) {
      status = -1;
    }
    const wantOk = entry.type !== 'gone';
    const ok = wantOk ? status === 200 : status === 404;
    if (ok) {
      console.log(`  OK   ${status}  ${entry.path}`);
    } else if (entry.status === 'planned') {
      warn++;
      console.log(`  WARN ${status}  ${entry.path} (planned, expected ${wantOk ? 200 : 404})`);
    } else {
      fail++;
      console.log(`  FAIL ${status}  ${entry.path} (expected ${wantOk ? 200 : 404})`);
    }
  }
} else {
  if (!existsSync(DIST)) {
    console.error('dist/ not found — run `npm run build` first.');
    process.exit(2);
  }
  for (const entry of MANIFEST) {
    const file = distFile(entry.path);
    const present = existsSync(file);
    const wantPresent = entry.type !== 'gone';
    const ok = wantPresent ? present : !present;
    if (ok) {
      console.log(`  OK   ${entry.path}`);
    } else if (entry.status === 'planned') {
      warn++;
      console.log(`  WARN ${entry.path} (planned, not built yet)`);
    } else {
      fail++;
      console.log(`  FAIL ${entry.path} (${wantPresent ? 'missing from' : 'should not be in'} dist)`);
    }
  }
}

console.log(`\n${MANIFEST.length} URLs checked — ${fail} failures, ${warn} planned-but-missing.`);
process.exit(fail > 0 ? 1 : 0);
