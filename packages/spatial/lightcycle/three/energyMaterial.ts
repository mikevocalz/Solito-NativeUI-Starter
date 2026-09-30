import * as THREE from 'three/webgpu';
import * as t3 from '@typegpu/three';
import { d, std } from 'typegpu';

export type LightCycleEnergyMaterial = {
  material: THREE.MeshBasicNodeMaterial;
  setColor: (hex: string) => void;
  setIntensity: (value: number) => void;
};

/**
 * Energy material authored in TypeGPU and embedded into Three's TSL graph.
 *
 * This deliberately stays renderer-agnostic at the gameplay layer: the same
 * simulation only supplies color/intensity. WebGPU is responsible for the
 * animated energy treatment.
 */
export function createLightCycleEnergyMaterial(
  color = '#00f3ff',
): LightCycleEnergyMaterial {
  const colorValue = new THREE.Color(color);
  const colorUniform = t3.uniform(colorValue, d.vec3f);
  const intensityUniform = t3.uniform(1, d.f32);

  const material = new THREE.MeshBasicNodeMaterial();
  material.transparent = true;
  material.depthWrite = true;
  material.colorNode = t3.toTSL(() => {
    'use gpu';

    const uv = t3.uv().$;
    const time = t3.time.$;
    const stripe = std.abs(std.sin((uv.y * 42 + time * 4.5) * 3.14159265));
    const core = 0.72 + stripe * 0.28;
    const edge = 1 - std.abs(uv.x * 2 - 1);
    const glow = core * (0.78 + edge * 0.22) * intensityUniform.$;

    return d.vec4f(colorUniform.$ * glow, 0.92);
  });

  return {
    material,
    setColor(hex) {
      colorValue.set(hex);
      const node = colorUniform.node as typeof colorUniform.node & {
        value?: THREE.Color;
      };
      if ('value' in node) node.value = colorValue;
    },
    setIntensity(value) {
      const node = intensityUniform.node as typeof intensityUniform.node & {
        value?: number;
      };
      if ('value' in node) node.value = Math.max(0, value);
    },
  };
}
