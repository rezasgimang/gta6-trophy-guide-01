// Leonida Trophy Guide — the entry program (Node 22, standard library only).
// The guide itself is app/: plain static files that open at app/index.html in a
// desktop browser and work offline (ES modules, CSS, a JSON data file, no build
// step, nothing fetched over the network). This program hands the entry in: it
// copies app/ and screenshots/ from beside this file into /output and writes
// /output/dossier.json with the vendored make.fun library, which is the summary
// the judge reads — the screenshots, the first load's files and bytes, and the
// source. vendor/makefun-frontend.ts stays exactly as the kit shipped it: the
// scorer requires dossier.json to be byte for byte what that library writes.
//
// Run it outside the grader with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Serve the guide while building with `node serve.ts`, then open http://localhost:8080.

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(outputDir, { recursive: true });
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
mkdirSync(join(outputDir, 'screenshots'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The scorer's caps: text_max_bytes shapes the dossier's text; the rest refuse
// an entry the scorer would refuse — more than 4 screenshots or one over 256 KiB,
// more than 993 files and directories in app/ or 48 MiB of app files (app/ counts
// beside /output's own 1000-entry cap, its screenshots/ and dossier.json).
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
