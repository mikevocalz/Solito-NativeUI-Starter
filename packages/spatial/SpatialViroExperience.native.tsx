'use client';

import type { ComponentType } from 'react';
import { Text, View } from '@acme/ui/tw';
import {
  isPico,
  isQuest,
  Viro3DSceneNavigator,
  ViroVirtualButton,
  ViroVirtualJoystick,
  ViroXRSceneNavigator,
} from './viro';
import { SpatialDemoScene } from './SpatialDemoScene';
import { TabletopColocationScene } from './TabletopColocationScene.native';
import { gridRace, useGridRaceStore } from './gridRaceStore';
import { useTabletopSessionStore } from './tabletopSessionStore';

type HeadsetNavigatorProps = {
  initialScene?: { scene: ComponentType<any> };
  arInitialScene?: { scene: ComponentType<any> };
  vrInitialScene?: { scene: ComponentType<any> };
  vrModeEnabled?: boolean;
  passthroughEnabled?: boolean;
  handTrackingEnabled?: boolean;
  trackingOrigin?: 'eye' | 'floor';
  provider?: 'reactvision' | 'arcore' | 'none';
  hdrEnabled?: boolean;
  pbrEnabled?: boolean;
  bloomEnabled?: boolean;
  shadowsEnabled?: boolean;
  multisamplingEnabled?: boolean;
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
          {phase === 'gateway' ? 'Select gate or start race' : 'Tap stick left/right to turn • push up or A to boost'}
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
      <ViroVirtualButton
        controllerId="grid-racer"
        button="A"
        size={58}
        tintColor="rgba(255,122,0,0.78)"
        onPressIn={() => gridRace.setBoost(true)}
        onPressOut={() => gridRace.setBoost(false)}
        style={{ position: 'absolute', right: 30, bottom: 38, width: 58, height: 58 }}
      />
    </View>
  );
}

export function SpatialViroExperience() {
  const headset = isQuest || isPico;
  const tabletopMode = useTabletopSessionStore((state) => state.mode);
  const sharedTabletop = tabletopMode === 'host' || tabletopMode === 'guest';

  if (sharedTabletop) {
    return (
      <HeadsetNavigator
        initialScene={{ scene: TabletopColocationScene }}
        arInitialScene={{ scene: TabletopColocationScene }}
        vrInitialScene={{ scene: TabletopColocationScene }}
        vrModeEnabled
        passthroughEnabled={isQuest}
        handTrackingEnabled
        trackingOrigin="floor"
        provider="reactvision"
        hdrEnabled
        pbrEnabled
        bloomEnabled
        shadowsEnabled
        multisamplingEnabled
        style={{ flex: 1 }}
      />
    );
  }

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
        initialScene={{ scene: SpatialDemoScene as never }}
        style={{ flex: 1 }}
      />
      <FlatPreviewControls />
    </View>
  );
}
