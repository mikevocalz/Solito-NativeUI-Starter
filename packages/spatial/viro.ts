import * as ViroRuntime from '@reactvision/react-viro';

export {
  Viro3DSceneNavigator,
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroGameLoop,
  ViroMaterials,
  ViroNode,
  ViroPolyline,
  ViroQuad,
  ViroScene,
  ViroText,
  ViroVirtualJoystick,
  ViroXRSceneNavigator,
  isQuest,
} from '@reactvision/react-viro';

/**
 * Platform-neutral type-resolution anchor. React Native selects viro.native.ts
 * at runtime; TypeScript may still inspect this file while checking .native
 * consumers, so optional fork capabilities are represented here too.
 */
export const isPico = Boolean(
  (ViroRuntime as typeof ViroRuntime & { isPico?: boolean }).isPico,
);
