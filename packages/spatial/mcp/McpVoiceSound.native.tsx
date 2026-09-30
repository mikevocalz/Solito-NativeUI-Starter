'use client';

import { ViroSound } from '../viro';
import type {
  LightCycleMatchState,
  LightCyclePlayerId,
} from '../lightcycle/tabletopCore';
import {
  deriveMcpVoiceCue,
  type McpVoiceCueName,
} from './mcpVoice';

type ViroAudioSource = number | { uri: string };

type Props = {
  state: LightCycleMatchState;
  localPlayerId: LightCyclePlayerId;
  sources: Partial<Record<McpVoiceCueName, ViroAudioSource>>;
  enabled?: boolean;
  volume?: number;
};

export function McpVoiceSoundNative({
  state,
  localPlayerId,
  sources,
  enabled = true,
  volume = 0.94,
}: Props) {
  if (!enabled) return null;

  const cue = deriveMcpVoiceCue(state, localPlayerId);
  if (!cue) return null;

  const source = sources[cue.name];
  if (!source) return null;

  return (
    <ViroSound
      key={cue.eventKey}
      source={source}
      paused={false}
      loop={false}
      muted={false}
      volume={volume}
    />
  );
}
