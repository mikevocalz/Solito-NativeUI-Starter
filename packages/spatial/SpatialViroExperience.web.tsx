'use client';

import type { ComponentType } from 'react';
import { Viro3DSceneNavigator } from './viro';
import { SpatialDemoScene } from './SpatialDemoScene';

type WebNavigatorProps = {
  initialScene: { scene: ComponentType<any> };
  webRendererOptions: { assetBaseUrl: string };
  style?: Record<string, unknown>;
};

// Public Viro's root declaration describes the native navigator and omits the
// web-only renderer options that Viro3DSceneNavigator.web.tsx accepts. Narrow
// the cast to this platform adapter; the shared scene stays fully typed.
const WebViro3DSceneNavigator =
  Viro3DSceneNavigator as unknown as ComponentType<WebNavigatorProps>;

export function SpatialViroExperience() {
  return (
    <WebViro3DSceneNavigator
      initialScene={{ scene: SpatialDemoScene }}
      webRendererOptions={{ assetBaseUrl: '/viro/wasm/' }}
      style={{ flex: 1 }}
    />
  );
}
