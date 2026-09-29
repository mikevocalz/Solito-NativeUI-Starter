'use client';

import type { ComponentType } from 'react';
import * as Viro from '@reactvision/react-viro';
import { ViroQuad, ViroText } from '@reactvision/react-viro';

type ForkRivePanel = ComponentType<{
  source: {
    rivBytes: ArrayBuffer;
    artboard?: string;
    stateMachine?: string;
    fit?: 'contain' | 'cover' | 'fill';
  };
  width: number;
  height: number;
  position?: [number, number, number];
  resolution?: { width: number; height: number };
}>;

const ViroRivePanel = (Viro as unknown as { ViroRivePanel?: ForkRivePanel }).ViroRivePanel;

/**
 * Adapter for the user's Nitro-backed ViroRivePanel.
 *
 * With stock Viro 3.0.1 this renders a visible placeholder. When the app
 * overrides @reactvision/react-viro to mikevocalz/viro, the exact same shared
 * scene can hand compiled .riv bytes to the native surface bridge.
 */
export function SpatialRivePanel({
  bytes,
  position = [0, 0.1, -2.2],
}: {
  bytes?: ArrayBuffer;
  position?: [number, number, number];
}) {
  if (bytes && ViroRivePanel) {
    return (
      <ViroRivePanel
        source={{
          rivBytes: bytes,
          artboard: 'SpatialPanel',
          stateMachine: 'Main',
          fit: 'contain',
        }}
        width={1.3}
        height={0.8}
        position={position}
        resolution={{ width: 1040, height: 640 }}
      />
    );
  }

  return (
    <>
      <ViroQuad position={position} width={1.3} height={0.8} materials={['spatialDark']} />
      <ViroText
        position={[position[0], position[1], position[2] + 0.01]}
        width={2.4}
        height={0.5}
        scale={[0.4, 0.4, 0.4]}
        text={ViroRivePanel ? 'Load a .riv asset to activate the Viro Rive surface' : 'Viro fork Rive bridge available after fork override'}
        style={{ fontSize: 18, color: '#2cf6ff', textAlign: 'center' }}
      />
    </>
  );
}
