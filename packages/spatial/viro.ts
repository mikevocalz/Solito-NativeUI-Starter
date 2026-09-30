import * as ViroRuntime from '@reactvision/react-viro';

export {
  Viro3DObject,
  Viro3DSceneNavigator,
  ViroAnimations,
  ViroARScene,
  ViroARPlaneSelector,
  ViroSharedFrame,
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
  invertTransform,
  parseLocationTransform,
  poseCsv,
  transformDirection,
  worldToLocation,
  ViroXRSceneNavigator,
  useViroColocation,
  useViroColocationRoom,
  useViroReplicatedState,
  metaSpatialAnchorFrameSource,
  cloudAnchorFrameSource,
  visionOSSharedSpaceFrameSource,
  normaliseJoinCode,
  formatJoinCode,
  isQuest,
} from '@reactvision/react-viro';

export const isPico = Boolean(
  (ViroRuntime as typeof ViroRuntime & { isPico?: boolean }).isPico,
);

const visionRuntimeValue = (
  ViroRuntime as typeof ViroRuntime & {
    isVisionOS?: boolean | (() => boolean);
  }
).isVisionOS;

export const isVisionOS =
  typeof visionRuntimeValue === 'function'
    ? Boolean(visionRuntimeValue())
    : Boolean(visionRuntimeValue);

type ForkHapticOptions = {
  hand?: 'left' | 'right' | 'both' | 'active';
  amplitude?: number;
  durationSec?: number;
};

type ForkViroRuntime = typeof ViroRuntime & {
  useVRViewTag?: () => number | null;
  triggerHaptic?: (viewTag: number, options?: ForkHapticOptions) => void;
};

const forkRuntime = ViroRuntime as ForkViroRuntime;
const useForkViewTag = forkRuntime.useVRViewTag ?? (() => null);

export function useViroVRViewTag() {
  return useForkViewTag();
}

export function triggerViroHaptic(
  viewTag: number | null,
  options?: ForkHapticOptions,
) {
  if (viewTag == null) return;
  forkRuntime.triggerHaptic?.(viewTag, options);
}
