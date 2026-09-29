import { cp, mkdir, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const require = createRequire(import.meta.url);

let rendererRoot;
try {
  rendererRoot = dirname(require.resolve('@reactvision/viro-web-renderer/package.json'));
} catch {
  process.exit(0);
}

const targets = [
  join(root, 'apps/web/public/viro'),
  join(root, 'apps/mobile/public/viro'),
];

for (const target of targets) {
  await mkdir(target, { recursive: true });
  for (const folder of ['wasm', 'slam']) {
    const source = join(rendererRoot, folder);
    try {
      await access(source);
      await cp(source, join(target, folder), { recursive: true, force: true });
    } catch {
      // A renderer release may not ship every optional sidecar family.
    }
  }
}
