'use client';

import {
  Viro3DSceneNavigator,
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroMaterials,
  ViroPolyline,
  ViroScene,
  ViroText,
} from '@reactvision/react-viro';

ViroMaterials.createMaterials({
  spatialCyan: { diffuseColor: '#2cf6ff', lightingModel: 'Constant' },
  spatialViolet: { diffuseColor: '#8b5cf6', lightingModel: 'Constant' },
  spatialDark: { diffuseColor: '#080b14', lightingModel: 'Blinn' },
});

const GRID = Array.from({ length: 17 }, (_, index) => index - 8);

function SpatialDemoScene() {
  return (
    <ViroScene>
      <ViroAmbientLight color="#6cecff" intensity={220} />
      <ViroDirectionalLight color="#c4b5fd" intensity={600} direction={[0, -1, -0.35]} />

      {GRID.map((offset) => (
        <ViroPolyline
          key={`grid-x-${offset}`}
          points={[[offset, -1.6, -1], [offset, -1.6, -18]]}
          thickness={0.012}
          materials={['spatialCyan']}
        />
      ))}
      {Array.from({ length: 18 }, (_, index) => (
        <ViroPolyline
          key={`grid-z-${index}`}
          points={[[-8, -1.6, -1 - index], [8, -1.6, -1 - index]]}
          thickness={0.012}
          materials={['spatialCyan']}
        />
      ))}

      <ViroBox
        position={[0, -0.1, -4]}
        scale={[0.65, 0.65, 0.65]}
        materials={['spatialViolet']}
      />
      <ViroText
        text="SPATIAL / SOLITIO"
        position={[0, 1.4, -4]}
        width={5}
        height={1}
        style={{ fontSize: 26, color: '#dffcff', textAlign: 'center' }}
      />
    </ViroScene>
  );
}

ViroMaterials.createMaterials({
  spatialGlow: { diffuseColor: '#dffcff', lightingModel: 'Constant' },
});

export function SpatialViroExperience() {
  return (
    <Viro3DSceneNavigator
      // Public Viro 3.0.1 still types this field as a ViroScene instance even
      // though the navigator mounts it as a React component at runtime. The
      // user's fork fixes the annotation; keep the compatibility cast localized
      // here so consumers never inherit the upstream typing bug.
      initialScene={{ scene: SpatialDemoScene as never }}
      webRendererOptions={{ assetBaseUrl: '/viro/wasm/' }}
      style={{ flex: 1 }}
    />
  );
}
