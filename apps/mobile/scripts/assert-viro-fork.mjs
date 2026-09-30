import { existsSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);

let packageJsonPath;
try {
  packageJsonPath = require.resolve('@reactvision/react-viro/package.json');
} catch {
  console.error('[Viro] @reactvision/react-viro is not installed.');
  process.exit(1);
}

const root = dirname(packageJsonPath);
const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
const platformSource = join(root, 'components/Utilities/ViroPlatform.ts');

const hasPico =
  existsSync(platformSource) &&
  readFileSync(platformSource, 'utf8').includes('isPico');
const hasRivePanel = existsSync(join(root, 'components/ViroRivePanel.tsx'));
const hasSpatialLayout = existsSync(
  join(root, 'components/Spatial/ViroSpatialLayout.tsx'),
);
const hasOpenXRBridge = existsSync(
  join(root, 'components/Utilities/VRModuleOpenXR.ts'),
);

const expoPeers = String(pkg.peerDependencies?.expo ?? '');
const rnPeers = String(pkg.peerDependencies?.['react-native'] ?? '');
const sdk58PeerLane =
  expoPeers.includes('<59') &&
  rnPeers.includes('<0.89');

const forkCompatible =
  sdk58PeerLane &&
  hasPico &&
  hasRivePanel &&
  hasSpatialLayout &&
  hasOpenXRBridge;

if (!forkCompatible) {
  console.error(`
[Viro] Native/headset development requires the mikevocalz SDK-58 fork.

Resolved package:
  ${packageJsonPath}
Resolved version:
  ${pkg.version ?? 'unknown'}

The public @reactvision/react-viro package remains installed only so public
clones, web, Storybook and CI can resolve Viro without access to the private
fork. It is intentionally NOT accepted for Expo SDK 58 native/headset builds.

Enable the fork, reinstall, then retry:

  overrides:
    "@reactvision/react-viro": "github:mikevocalz/viro#decax9-three-panel"

  pnpm install

Required fork capabilities:
  Expo <59 peer lane
  React Native <0.89 peer lane
  PICO platform detection
  ViroRivePanel
  ViroSpatialLayout
  VRModuleOpenXR
`);
  process.exit(1);
}

console.log(
  `[Viro] Native fork verified: ${pkg.version} (${packageJsonPath})`,
);
