'use client';

import { Viro3DSceneNavigator } from '@reactvision/react-viro';
import { SpatialDemoScene } from './SpatialDemoScene';

export function SpatialViroExperience() {
  return (
    <Viro3DSceneNavigator
      // Public Viro 3.0.1's shared declaration incorrectly types scene as an
      // instance; runtime mounts the component. Keep the upstream workaround
      // local to this host adapter.
      initialScene={{ scene: SpatialDemoScene as never }}
      style={{ flex: 1 }}
    />
  );
}
