'use client';

import { GridFloor, Heading, Text } from '@acme/ui';
import { Section, View } from '@acme/ui/tw';
import { RiveStage } from './rive/RiveStage';
import { ForkSpatialLayout, getSpatialForkCapabilities } from './ForkSpatialLayout';
import { SpatialViroExperience } from './SpatialViroExperience';

const RIVE_DEMO = 'https://cdn.rive.app/animations/vehicles.riv';

export function SpatialScreen() {
  const capabilities = getSpatialForkCapabilities();

  const tools = (
    <View className="gap-3 rounded-2xl border border-cyan-300/20 bg-black/70 p-4">
      <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
        Layout backend
      </Text>
      <Text className="text-sm text-white">
        {capabilities.metaSpatialWindows ? 'Meta VR Layout SDK spatial window' : 'Inline / Viro spatial fallback'}
      </Text>
      <Text className="text-xs text-white/60">
        Viro Rive surface: {capabilities.viroRivePanel ? 'fork bridge detected' : 'stock fallback'}
      </Text>
    </View>
  );

  return (
    <ForkSpatialLayout panel={tools}>
      <GridFloor className="flex-1">
        <View className="mx-auto w-full max-w-screen-2xl flex-1 gap-6 px-4 py-8 sm:px-6 lg:px-8">
          <Section className="gap-2">
            <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
              Spatial-Solotio-Starter
            </Text>
            <Heading level={1} size="display-sm" className="text-white">
              One scene. Expo, WebXR, Quest and Pico.
            </Heading>
            <Text className="max-w-3xl text-white/65">
              Expo SDK 58 universal UI outside the scene, Viro for shared immersive 3D,
              Rive for animated interface surfaces, and Meta system windows when the
              Viro fork exposes the Layout SDK bridge.
            </Text>
          </Section>

          <View className="min-h-[420px] overflow-hidden rounded-3xl border border-cyan-300/25 bg-black/45 shadow-2xl">
            <SpatialViroExperience />
          </View>

          <View className="gap-3">
            <Text className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-200">
              Universal Rive surface
            </Text>
            <RiveStage source={RIVE_DEMO} />
          </View>

          {!capabilities.metaSpatialWindows ? tools : null}
        </View>
      </GridFloor>
    </ForkSpatialLayout>
  );
}
