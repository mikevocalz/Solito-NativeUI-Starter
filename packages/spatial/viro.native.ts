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
 * PICO detection is available in the mikevocalz Viro fork. Keep the public
 * starter installable against ReactVision 3.0.1, where the export does not
 * exist yet, then light it up automatically when the fork override is active.
 */
export const isPico = Boolean(
  (ViroRuntime as typeof ViroRuntime & { isPico?: boolean }).isPico,
);
