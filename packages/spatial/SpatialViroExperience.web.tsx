'use client';

import type { ComponentType } from 'react';
import { Text, View } from '@acme/ui/tw';
import { Viro3DSceneNavigator, ViroVirtualJoystick } from './viro';
import { SpatialDemoScene } from './SpatialDemoScene';
import { gridRace, useGridRaceStore } from './gridRaceStore';

type WebNavigatorProps = {
  initialScene: { scene: ComponentType<any> };
  webRendererOptions: { assetBaseUrl: string };
  style?: Record<string, unknown>;
};

const WebViro3DSceneNavigator =
  Viro3DSceneNavigator as unknown as ComponentType<WebNavigatorProps>;

export function SpatialViroExperience() {
  const phase = useGridRaceStore((state) => state.phase);

  return (
    <View className="relative flex-1">
      <WebViro3DSceneNavigator
        initialScene={{ scene: SpatialDemoScene }}
        webRendererOptions={{ assetBaseUrl: '/viro/wasm/' }}
        style={{ flex: 1 }}
      />

      <View className="pointer-events-box-none absolute inset-0">
        <View className="absolute bottom-4 left-4 gap-2">
          <Text className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-100">
            {phase === 'gateway' ? 'Select gate or start race' : 'Steer / push up to boost'}
          </Text>
          <ViroVirtualJoystick
            controllerId="grid-racer"
            stickSide="left"
            radius={52}
            tintColor="rgba(0,243,255,0.72)"
            onStickChange={(event) => {
              const { x, y } = event.nativeEvent;
              gridRace.setStick(x, y);
            }}
            style={{ width: 104, height: 104 }}
          />
        </View>
      </View>
    </View>
  );
}
