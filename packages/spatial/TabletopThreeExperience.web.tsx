'use client';

import { useEffect } from 'react';
import { Text, View } from '@acme/ui/tw';
import { ThreeLightCycleCanvas } from './lightcycle/three/ThreeLightCycleCanvas.web';
import { tabletopSoloInput } from './tabletopSoloInputStore';
import { useTabletopSoloDriver } from './useTabletopSoloDriver';
import { useTabletopSessionStore } from './tabletopSessionStore';

const LIGHTCYCLE_ASSET =
  process.env.NEXT_PUBLIC_LIGHTCYCLE_GLB_URL ??
  process.env.EXPO_PUBLIC_LIGHTCYCLE_GLB_URL ??
  undefined;

const MCP_GNM_ASSET =
  process.env.NEXT_PUBLIC_MCP_GNM_GLB_URL ??
  process.env.EXPO_PUBLIC_MCP_GNM_GLB_URL ??
  undefined;

export function TabletopThreeExperience() {
  const playerName = useTabletopSessionStore((state) => state.playerName);
  const { getState } = useTabletopSoloDriver(playerName);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (
        key === 'arrowleft' ||
        key === 'a' ||
        key === 'arrowright' ||
        key === 'd' ||
        key === ' ' ||
        key === 'shift'
      ) {
        event.preventDefault();
      }

      if (!event.repeat && (key === 'arrowleft' || key === 'a')) {
        tabletopSoloInput.queueTurn(-1);
      }
      if (!event.repeat && (key === 'arrowright' || key === 'd')) {
        tabletopSoloInput.queueTurn(1);
      }
      if (key === ' ' || key === 'shift') {
        tabletopSoloInput.setBoost(true);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === ' ' || key === 'shift') {
        tabletopSoloInput.setBoost(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      tabletopSoloInput.setBoost(false);
    };
  }, []);

  return (
    <View className="relative flex-1 overflow-hidden bg-black">
      <ThreeLightCycleCanvas
        getState={getState}
        assetUri={LIGHTCYCLE_ASSET}
        mcpAssetUri={MCP_GNM_ASSET}
        style={{ flex: 1 }}
      />
      <View
        pointerEvents="none"
        className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-3"
      >
        <Text className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-cyan-100">
          A / ← TURN LEFT · D / → TURN RIGHT · SPACE / SHIFT BOOST
        </Text>
        <Text className="mt-1 text-center text-[10px] text-white/55">
          Three.js WebGPU + TypeGPU · deterministic 60 Hz Light Cycle core
        </Text>
      </View>
    </View>
  );
}
