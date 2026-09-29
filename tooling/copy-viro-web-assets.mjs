import { access, cp, mkdir, readFile, writeFile } from 'node:fs/promises';
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

/**
 * Viro Web Renderer 1.0.0 correctly supports an explicit runtime assetBaseUrl,
 * but its fallback paths are static `new URL("../wasm/", import.meta.url)`
 * expressions. Turbopack eagerly treats those as module requests even though
 * the fallback is never used by this starter, then fails because wasm/ and
 * slam/ are asset directories rather than JavaScript modules.
 *
 * Keep the same fallback behavior while making the URL segment non-static to
 * the bundler. This is intentionally tiny and guarded by exact source text so a
 * future renderer release simply becomes a no-op instead of being rewritten
 * blindly.
 */
async function patchRuntimeOnlyAssetFallbacks() {
  const patches = [
    {
      file: join(rendererRoot, 'dist/loader.js'),
      from: 'new URL("../wasm/", import.meta.url).href',
      to: 'new URL(["..", "wasm", ""].join("/"), import.meta.url).href',
    },
    {
      file: join(rendererRoot, 'dist/slamLoader.js'),
      from: 'new URL("../slam/", import.meta.url).href',
      to: 'new URL(["..", "slam", ""].join("/"), import.meta.url).href',
    },
  ];

  for (const patch of patches) {
    try {
      const source = await readFile(patch.file, 'utf8');
      if (!source.includes(patch.from)) continue;
      await writeFile(patch.file, source.replaceAll(patch.from, patch.to));
    } catch {
      // Future package layouts may move these files. The explicit public asset
      // base still works; CI will surface any bundler regression.
    }
  }
}

await patchRuntimeOnlyAssetFallbacks();

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
