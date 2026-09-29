import * as ViroRuntime from '@reactvision/react-viro';

export {
  Viro3DSceneNavigator,
  ViroAmbientLight,
  ViroBox,
  ViroController,
  ViroDirectionalLight,
  ViroGameLoop,
  ViroMaterials,
  ViroNode,
  ViroPolyline,
  ViroQuad,
  ViroScene,
  ViroText,
  ViroVirtualButton,
  ViroVirtualJoystick,
  ViroXRSceneNavigator,
  isQuest,
} from '@reactvision/react-viro';

export const isPico = Boolean(
  (ViroRuntime as typeof ViroRuntime & { isPico?: boolean }).isPico,
);
