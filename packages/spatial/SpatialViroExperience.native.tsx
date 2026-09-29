'use client';

import type { ComponentType } from 'react';
import { Text, View } from '@acme/ui/tw';
import {
  isPico,
  isQuest,
  Viro3DSceneNavigator,
  ViroVirtualJoystick,
  ViroXRSceneNavigator,
} from './viro';
import { SpatialDemoScene } from './SpatialDemoScene';
import { gridRace, useGridRaceStore } from './gridRaceStore';

type HeadsetNavigatorProps = {
  initialScene?: { scene: ComponentType<any> };
  vrInitialScene?: { scene: ComponentType<any> };
  vrModeEnabled?: boolean;
  passthroughEnabled?: boolean;
  handTrackingEnabled?: boolean;
  trackingOrigin?: 'eye' | 'floor';
  style?: Record<string, unknown>;
};

const HeadsetNavigator =
  ViroXRSceneNavigator as unknown as ComponentType<HeadsetNavigatorProps>;

function FlatPreviewControls() {
  const phase = useGridRaceStore((state) => state.phase);

  return (
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
  );
}

export function SpatialViroExperience() {
  const headset = isQuest || isPico;

  if (headset) {
    return (
      <HeadsetNavigator
        initialScene={{ scene: SpatialDemoScene }}
        vrInitialScene={{ scene: SpatialDemoScene }}
        vrModeEnabled
        passthroughEnabled={false}
        handTrackingEnabled
        trackingOrigin="floor"
        style={{ flex: 1 }}
      />
    );
  }

  return (
    <View className="relative flex-1">
      <Viro3DSceneNavigator
        // Public Viro 3.0.1's shared declaration incorrectly types scene as an
        // instance; runtime mounts the component. Keep the workaround local.
        initialScene={{ scene: SpatialDemoScene as never }}
        style={{ flex: 1 }}
      />
      <FlatPreviewControls />
    </View>
  );
}
