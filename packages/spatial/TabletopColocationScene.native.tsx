'use client';

import { useEffect, useMemo } from 'react';
import {
  ViroARScene,
  ViroAmbientLight,
  ViroBox,
  ViroDirectionalLight,
  ViroNode,
  ViroSharedFrame,
  ViroText,
  isQuest,
  metaSpatialAnchorFrameSource,
  useViroColocation,
  useViroColocationRoom,
  useViroReplicatedState,
} from './viro';
import { LIGHTCYCLE_REPLICATION_IDS } from './lightcycle/sessionProtocol';
import {
  tabletopSession,
  useTabletopSessionStore,
} from './tabletopSessionStore';

const API_KEY = process.env.EXPO_PUBLIC_REACTVISION_API_KEY ?? '';
const PROJECT_ID = process.env.EXPO_PUBLIC_REACTVISION_PROJECT_ID ?? '';
const ENDPOINT =
  process.env.EXPO_PUBLIC_REACTVISION_ENDPOINT || undefined;

type SceneProps = {
  sceneNavigator?: any;
  arSceneNavigator?: any;
};

function SharedTabletopRoom({
  roomId,
}: {
  roomId: string;
}) {
  const mode = useTabletopSessionStore((state) => state.mode);
  const name = useTabletopSessionStore((state) => state.playerName);
  const ready = useTabletopSessionStore((state) => state.ready);
  const setReady = useTabletopSessionStore((state) => state.setReady);
  const localPlayerId = mode === 'host' ? 'p1' : 'p2';
  const remotePlayerId = localPlayerId === 'p1' ? 'p2' : 'p1';

  const colocated = useViroColocation({
    roomId,
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    endpoint: ENDPOINT,
    enabled: true,
  });

  const replication = useViroReplicatedState({
    roomId,
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    endpoint: ENDPOINT,
    enabled: true,
    onReject: (rejection) => {
      tabletopSession.setState({
        error: `Replication rejected: ${rejection.reason}`,
      });
    },
  });

  const localEntityId = LIGHTCYCLE_REPLICATION_IDS.player(localPlayerId);
  const remoteEntityId = LIGHTCYCLE_REPLICATION_IDS.player(remotePlayerId);
  const localEntity = replication.byId(localEntityId);
  const remoteEntity = replication.byId(remoteEntityId);

  useEffect(() => {
    if (replication.state !== 'synced') return;
    if (!localEntity) {
      replication.claim(localEntityId);
      return;
    }
    if (!replication.isMine(localEntityId)) return;

    const fields = localEntity.fields ?? {};
    if (
      fields.name !== name ||
      fields.ready !== ready ||
      fields.localized !== true ||
      fields.connected !== true
    ) {
      replication.set(
        localEntityId,
        {
          playerId: localPlayerId,
          name,
          ready,
          localized: true,
          connected: true,
          cycleColor: localPlayerId === 'p1' ? 'cyan' : 'orange',
        },
        { optimistic: true },
      );
    }
  }, [
    localEntity,
    localEntityId,
    localPlayerId,
    name,
    ready,
    replication,
  ]);

  useEffect(() => {
    if (mode !== 'host' || replication.state !== 'synced') return;
    const matchId = LIGHTCYCLE_REPLICATION_IDS.match;
    const match = replication.byId(matchId);
    if (!match) {
      replication.claim(matchId);
      return;
    }
    if (!replication.isMine(matchId)) return;

    const p1Ready = localPlayerId === 'p1' ? ready : Boolean(remoteEntity?.fields.ready);
    const p2Ready = localPlayerId === 'p2' ? ready : Boolean(remoteEntity?.fields.ready);
    const nextPhase = p1Ready && p2Ready ? 'ready' : 'lobby';
    if (match.fields.phase !== nextPhase) {
      replication.set(
        matchId,
        {
          phase: nextPhase,
          hostPeerId: replication.localPeerId,
          p1Ready,
          p2Ready,
        },
        { optimistic: true },
      );
    }
  }, [
    localPlayerId,
    mode,
    ready,
    remoteEntity,
    replication,
  ]);

  const remoteName =
    typeof remoteEntity?.fields.name === 'string'
      ? remoteEntity.fields.name
      : 'WAITING…';
  const remoteReady = Boolean(remoteEntity?.fields.ready);
  const peers = colocated.peers.filter((peer) => peer.peerId !== colocated.localPeerId);

  return (
    <ViroNode>
      <ViroBox
        position={[0, 0, 0]}
        scale={[0.6, 0.015, 0.4]}
        materials={['raceDark']}
      />
      <ViroText
        text="CLASSIC GRID DUEL"
        position={[0, 0.5, 0]}
        rotation={[-90, 0, 0]}
        width={1.15}
        height={0.15}
        style={{ fontSize: 18, color: '#fff6cf', textAlign: 'center' }}
      />
      <ViroText
        text={`${name}  ${ready ? 'READY' : 'NOT READY'}   /   ${remoteName}  ${remoteReady ? 'READY' : 'WAITING'}`}
        position={[0, 0.03, 0.48]}
        rotation={[-90, 0, 0]}
        width={1.2}
        height={0.15}
        style={{ fontSize: 12, color: '#00f3ff', textAlign: 'center' }}
      />
      <ViroText
        text={`ROOM SYNC: ${replication.state.toUpperCase()} · PEERS ${peers.length + 1}`}
        position={[0, 0.03, -0.48]}
        rotation={[-90, 180, 0]}
        width={1.2}
        height={0.12}
        style={{ fontSize: 9, color: '#ff8a00', textAlign: 'center' }}
      />

      <ViroBox
        position={localPlayerId === 'p1' ? [-0.38, 0.05, 0] : [0.38, 0.05, 0]}
        scale={[0.08, 0.035, 0.17]}
        materials={[localPlayerId === 'p1' ? 'raceCyan' : 'raceOrange']}
      />
      {remoteEntity ? (
        <ViroBox
          position={remotePlayerId === 'p1' ? [-0.38, 0.05, 0] : [0.38, 0.05, 0]}
          scale={[0.08, 0.035, 0.17]}
          materials={[remotePlayerId === 'p1' ? 'raceCyan' : 'raceOrange']}
        />
      ) : null}

      <ViroBox
        position={[0, 0.07, 0.28]}
        scale={[0.18, 0.04, 0.07]}
        materials={[ready ? 'raceCyan' : 'raceOrange']}
        onClick={() => setReady(!ready)}
      />
      <ViroText
        text={ready ? 'READY ✓' : 'PRESS TO READY'}
        position={[0, 0.115, 0.28]}
        rotation={[-90, 0, 0]}
        width={0.45}
        height={0.08}
        style={{ fontSize: 11, color: '#fff6cf', textAlign: 'center' }}
      />
    </ViroNode>
  );
}

export function TabletopColocationScene({
  sceneNavigator,
  arSceneNavigator,
}: SceneProps) {
  const mode = useTabletopSessionStore((state) => state.mode);
  const hostFrameRef = useTabletopSessionStore((state) => state.hostFrameRef);
  const joinCode = useTabletopSessionStore((state) => state.joinCode);
  const localized = useTabletopSessionStore((state) => state.localized);
  const setLocalized = useTabletopSessionStore((state) => state.setLocalized);
  const setRoomDisplayCode = useTabletopSessionStore(
    (state) => state.setRoomDisplayCode,
  );
  const setError = useTabletopSessionStore((state) => state.setError);

  const navigator = arSceneNavigator ?? sceneNavigator;
  const configured = Boolean(API_KEY && PROJECT_ID);

  const hostFrameSource = useMemo(
    () =>
      mode === 'host' && hostFrameRef && isQuest
        ? metaSpatialAnchorFrameSource(hostFrameRef, 'create')
        : null,
    [hostFrameRef, mode],
  );

  const room = useViroColocationRoom({
    apiKey: API_KEY,
    projectId: PROJECT_ID,
    endpoint: ENDPOINT,
    host:
      mode === 'host' && hostFrameRef && isQuest
        ? {
            frameKind: 'meta_group',
            frameRef: hostFrameRef,
            name: 'Light Cycle Grid',
          }
        : undefined,
    joinCode: mode === 'guest' ? joinCode : undefined,
    enabled:
      configured &&
      (mode === 'guest' || (mode === 'host' && localized && isQuest)),
  });

  useEffect(() => {
    if (room.displayCode) setRoomDisplayCode(room.displayCode);
  }, [room.displayCode, setRoomDisplayCode]);

  useEffect(() => {
    if (room.status === 'failed') {
      setError(room.error ?? 'Unable to join the shared Grid.');
    }
  }, [room.error, room.status, setError]);

  const frameSource = mode === 'host' ? hostFrameSource : room.frameSource;
  const roomReady = Boolean(room.roomId && localized);

  let status = 'PREPARING GRID';
  if (!configured) status = 'CO-LOCATION CREDENTIALS MISSING';
  else if (mode === 'host' && !isQuest) status = 'PHONE HOST PLACEMENT NEXT';
  else if (mode === 'guest' && room.status === 'working') status = 'FINDING GRID…';
  else if (frameSource && !localized) status = 'LOCALIZING GRID…';
  else if (localized && !room.roomId) status = 'CREATING ROOM…';
  else if (roomReady) status = 'GRID FOUND';

  return (
    <ViroARScene>
      <ViroAmbientLight color="#7cf8ff" intensity={120} />
      <ViroDirectionalLight
        color="#ff9b33"
        intensity={140}
        direction={[0, -1, -0.35]}
      />

      <ViroText
        text={status}
        position={[0, 0.15, -1.5]}
        width={2.8}
        height={0.3}
        style={{ fontSize: 18, color: '#fff6cf', textAlign: 'center' }}
      />

      {frameSource && navigator ? (
        <ViroSharedFrame
          source={frameSource}
          arSceneNavigator={navigator}
          maxAttempts={3}
          onLocalized={() => {
            setLocalized(true);
            setError(null);
          }}
          onLocalizeError={(error) => {
            setLocalized(false);
            setError(error);
          }}
          placeholder={
            <ViroText
              text="ALIGNING SHARED TABLE…"
              position={[0, -0.05, -1.2]}
              width={2.4}
              height={0.25}
              style={{ fontSize: 14, color: '#00f3ff', textAlign: 'center' }}
            />
          }
        >
          <ViroNode position={[0, -0.55, -1.1]}>
            {roomReady && room.roomId ? (
              <SharedTabletopRoom roomId={room.roomId} />
            ) : (
              <ViroBox
                scale={[0.6, 0.015, 0.4]}
                materials={['raceDark']}
              />
            )}
          </ViroNode>
        </ViroSharedFrame>
      ) : null}
    </ViroARScene>
  );
}
